from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import secrets
import logging
import random
import hmac
import hashlib
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import List, Optional

import razorpay

from models import (
    UserRegister, UserLogin, UserPublic, AuthResponse,
    Plan, DemoPlan, CreateOrderRequest, CreateOrderResponse,
    VerifyPaymentRequest, Order, License, BacktestRequest, BacktestResult,
)
from auth_utils import (
    hash_password, verify_password, create_access_token, get_current_user,
)
from seed import seed_plans

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client (initialized lazily if keys present)
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '').strip()
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '').strip()
USD_TO_INR = float(os.environ.get('USD_TO_INR', '83.0'))

_razorpay_client: Optional[razorpay.Client] = None


def get_razorpay_client():
    global _razorpay_client
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=503,
            detail='Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env',
        )
    if _razorpay_client is None:
        _razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    return _razorpay_client


app = FastAPI(title='TradeLens API')
api = APIRouter(prefix='/api')


# ---------- Helpers ----------
def _now() -> datetime:
    return datetime.now(timezone.utc)


def _public_user(u: dict) -> UserPublic:
    return UserPublic(
        id=u['id'], email=u['email'], name=u['name'], created_at=u['created_at']
    )


def _gen_license_key() -> str:
    parts = [secrets.token_hex(2).upper() for _ in range(4)]
    return 'TL-' + '-'.join(parts)


def _gen_api_key() -> str:
    return 'tl_live_' + secrets.token_urlsafe(24).replace('-', '').replace('_', '')[:24]


def _clean_doc(doc: dict) -> dict:
    """Remove Mongo _id."""
    if doc and '_id' in doc:
        doc = {k: v for k, v in doc.items() if k != '_id'}
    return doc


# ---------- Health ----------
@api.get('/')
async def root():
    return {'service': 'TradeLens API', 'status': 'ok'}


# ---------- Auth ----------
@api.post('/auth/register', response_model=AuthResponse)
async def register(payload: UserRegister):
    existing = await db.users.find_one({'email': payload.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')
    user_id = str(uuid.uuid4())
    user_doc = {
        'id': user_id,
        'email': payload.email.lower(),
        'name': payload.name.strip(),
        'password_hash': hash_password(payload.password),
        'created_at': _now(),
    }
    await db.users.insert_one(user_doc)
    token = create_access_token(user_id, user_doc['email'])
    return AuthResponse(token=token, user=_public_user(user_doc))


@api.post('/auth/login', response_model=AuthResponse)
async def login(payload: UserLogin):
    user = await db.users.find_one({'email': payload.email.lower()})
    if not user or not verify_password(payload.password, user.get('password_hash', '')):
        raise HTTPException(status_code=401, detail='Invalid email or password')
    token = create_access_token(user['id'], user['email'])
    return AuthResponse(token=token, user=_public_user(user))


@api.get('/auth/me', response_model=UserPublic)
async def me(user=Depends(get_current_user)):
    return _public_user(user)


# ---------- Plans ----------
@api.get('/plans', response_model=List[Plan])
async def list_plans():
    docs = await db.plans.find().to_list(20)
    return [Plan(**_clean_doc(d)) for d in docs]


@api.get('/plans/demo', response_model=DemoPlan)
async def get_demo():
    doc = await db.demo_plan.find_one({'id': 'demo'})
    if not doc:
        raise HTTPException(status_code=404, detail='Demo plan not found')
    return DemoPlan(**_clean_doc(doc))


# ---------- Payments ----------
def _amount_paise_from_usd(usd: float) -> int:
    inr = usd * USD_TO_INR
    return int(round(inr * 100))


@api.post('/payments/create-order', response_model=CreateOrderResponse)
async def create_order(req: CreateOrderRequest, user=Depends(get_current_user)):
    rzp = get_razorpay_client()

    if req.demo:
        demo = await db.demo_plan.find_one({'id': 'demo'})
        if not demo:
            raise HTTPException(404, 'Demo plan missing')
        plan_id = 'demo'
        plan_name = demo['name']
        period = demo['duration']
        amount_usd = float(demo['price_usd'])
    else:
        if not req.plan_id or req.option_index is None:
            raise HTTPException(400, 'plan_id and option_index required')
        plan = await db.plans.find_one({'id': req.plan_id})
        if not plan:
            raise HTTPException(404, 'Plan not found')
        if req.option_index < 0 or req.option_index >= len(plan['options']):
            raise HTTPException(400, 'Invalid option_index')
        opt = plan['options'][req.option_index]
        plan_id = plan['id']
        plan_name = plan['name']
        period = opt['period']
        amount_usd = float(opt['price_usd'])

    amount_paise = _amount_paise_from_usd(amount_usd)
    receipt = f'tl_{secrets.token_hex(6)}'[:40]

    try:
        rzp_order = rzp.order.create({
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': receipt,
            'payment_capture': 1,
            'notes': {
                'user_id': user['id'],
                'plan_id': plan_id,
                'period': period,
                'amount_usd': str(amount_usd),
            },
        })
    except Exception as e:
        raise HTTPException(502, f'Razorpay order creation failed: {e}')

    # Save pending order
    order_doc = {
        'id': str(uuid.uuid4()),
        'user_id': user['id'],
        'plan_id': plan_id,
        'plan_name': plan_name,
        'period': period,
        'amount_usd': amount_usd,
        'amount_paise': amount_paise,
        'razorpay_order_id': rzp_order['id'],
        'razorpay_payment_id': None,
        'status': 'created',
        'created_at': _now(),
        'option_index': req.option_index,
        'demo': req.demo,
    }
    await db.orders.insert_one(order_doc)

    return CreateOrderResponse(
        order_id=rzp_order['id'],
        amount_paise=amount_paise,
        currency='INR',
        key_id=RAZORPAY_KEY_ID,
        plan_label=f'{plan_name} \u2014 {period}',
        amount_usd=amount_usd,
    )


def _verify_signature(order_id: str, payment_id: str, signature: str) -> bool:
    body = f'{order_id}|{payment_id}'.encode('utf-8')
    expected = hmac.new(
        RAZORPAY_KEY_SECRET.encode('utf-8'), body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


@api.post('/payments/verify')
async def verify_payment(req: VerifyPaymentRequest, user=Depends(get_current_user)):
    if not RAZORPAY_KEY_SECRET:
        raise HTTPException(503, 'Razorpay not configured')

    if not _verify_signature(req.razorpay_order_id, req.razorpay_payment_id, req.razorpay_signature):
        raise HTTPException(400, 'Invalid signature')

    order = await db.orders.find_one({
        'razorpay_order_id': req.razorpay_order_id,
        'user_id': user['id'],
    })
    if not order:
        raise HTTPException(404, 'Order not found')

    if order['status'] == 'paid':
        # idempotent: return existing license
        existing_lic = await db.licenses.find_one({
            'user_id': user['id'],
            'plan_id': order['plan_id'],
            'razorpay_order_id': req.razorpay_order_id,
        })
        return {
            'success': True,
            'order': _clean_doc(order),
            'license': _clean_doc(existing_lic) if existing_lic else None,
        }

    # Determine validity & backtests limit
    if order.get('demo'):
        demo = await db.demo_plan.find_one({'id': 'demo'})
        hours = int(demo.get('hours', 1)) if demo else 1
        expires_at = _now() + timedelta(hours=hours)
        backtests_limit = int(demo.get('backtests_limit', 50)) if demo else 50
    else:
        plan = await db.plans.find_one({'id': order['plan_id']})
        opt = plan['options'][order['option_index']]
        expires_at = _now() + timedelta(days=int(opt['days']))
        backtests_limit = int(opt['backtests_limit'])

    license_doc = {
        'id': str(uuid.uuid4()),
        'user_id': user['id'],
        'plan_id': order['plan_id'],
        'plan_name': order['plan_name'],
        'period': order['period'],
        'key': _gen_license_key(),
        'api_key': _gen_api_key(),
        'status': 'active',
        'issued_at': _now(),
        'expires_at': expires_at,
        'backtests_used': 0,
        'backtests_limit': backtests_limit,
        'razorpay_order_id': req.razorpay_order_id,
    }
    await db.licenses.insert_one(license_doc)
    await db.orders.update_one(
        {'razorpay_order_id': req.razorpay_order_id},
        {'$set': {'status': 'paid', 'razorpay_payment_id': req.razorpay_payment_id}},
    )

    updated_order = await db.orders.find_one({'razorpay_order_id': req.razorpay_order_id})
    return {
        'success': True,
        'order': _clean_doc(updated_order),
        'license': _clean_doc(license_doc),
    }


# ---------- Orders & Licenses ----------
@api.get('/orders')
async def list_orders(user=Depends(get_current_user)):
    docs = await db.orders.find({'user_id': user['id']}).sort('created_at', -1).to_list(100)
    return [_clean_doc(d) for d in docs]


@api.get('/licenses')
async def list_licenses(user=Depends(get_current_user)):
    docs = await db.licenses.find({'user_id': user['id']}).sort('issued_at', -1).to_list(100)
    return [_clean_doc(d) for d in docs]


@api.get('/licenses/active')
async def active_license(user=Depends(get_current_user)):
    now = _now()
    doc = await db.licenses.find_one({
        'user_id': user['id'],
        'status': 'active',
        'expires_at': {'$gt': now},
    }, sort=[('issued_at', -1)])
    return _clean_doc(doc) if doc else None


# ---------- Backtest ----------
def _gen_equity_curve(n: int = 60, net_pnl_pct: float = 0.18) -> List[float]:
    curve = [100.0]
    target = 100.0 * (1 + net_pnl_pct)
    for i in range(1, n):
        progress = i / (n - 1)
        drift = (target - 100.0) * progress
        noise = random.gauss(0, 1.2)
        curve.append(round(100.0 + drift + noise, 3))
    return curve


@api.post('/backtest/run', response_model=BacktestResult)
async def run_backtest(req: BacktestRequest, user=Depends(get_current_user)):
    now = _now()
    lic = await db.licenses.find_one({
        'user_id': user['id'],
        'status': 'active',
        'expires_at': {'$gt': now},
    }, sort=[('issued_at', -1)])
    if not lic:
        raise HTTPException(403, 'No active license. Please purchase a plan first.')
    if lic['backtests_used'] >= lic['backtests_limit']:
        raise HTTPException(403, 'Backtest limit reached for this license.')

    # Synthesize plausible results
    sharpe = round(random.uniform(0.9, 2.4), 2)
    max_dd = round(random.uniform(-15.0, -3.5), 2)
    trades = random.randint(420, 2200)
    net_pnl_pct = random.uniform(0.08, 0.32)
    net_pnl = round(req.capital * net_pnl_pct, 2)
    duration_ms = random.randint(700, 1900)
    equity_curve = _gen_equity_curve(60, net_pnl_pct)

    result_doc = {
        'run_id': 'bt_' + secrets.token_hex(6),
        'strategy': req.strategy,
        'market': req.market,
        'sharpe': sharpe,
        'max_drawdown': max_dd,
        'trades': trades,
        'net_pnl': net_pnl,
        'duration_ms': duration_ms,
        'equity_curve': equity_curve,
        'license_id': lic['id'],
        'user_id': user['id'],
        'created_at': _now(),
    }
    await db.backtests.insert_one(result_doc)
    await db.licenses.update_one({'id': lic['id']}, {'$inc': {'backtests_used': 1}})

    return BacktestResult(**_clean_doc(result_doc))


# ---------- App wiring ----------

@app.get('/')
async def health_check():
    return {"status": "TradeLens API is running", "api_root": "/api"}

app.include_router(api)


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event('startup')
async def on_startup():
    await seed_plans(db)
    logger.info('TradeLens API started. Plans seeded.')


@app.on_event('shutdown')
async def on_shutdown():
    client.close()
