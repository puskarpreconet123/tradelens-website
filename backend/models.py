from datetime import datetime, timezone
from typing import List, Optional
import uuid
from pydantic import BaseModel, EmailStr, Field


def _id() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


# ----- Users -----
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: str = Field(min_length=1, max_length=80)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    name: str
    created_at: datetime


class AuthResponse(BaseModel):
    token: str
    user: UserPublic


# ----- Plans -----
class PlanOption(BaseModel):
    period: str
    price_usd: float
    detail: str
    days: int
    backtests_limit: int


class Plan(BaseModel):
    id: str
    name: str
    tag: str
    popular: bool = False
    options: List[PlanOption]
    features: List[str]


class DemoPlan(BaseModel):
    id: str = 'demo'
    name: str = 'Try Demo'
    price_usd: float
    duration: str
    limit: str
    days: int
    backtests_limit: int
    perks: List[str]


# ----- Payments -----
class CreateOrderRequest(BaseModel):
    plan_id: Optional[str] = None
    option_index: Optional[int] = None
    demo: bool = False


class CreateOrderResponse(BaseModel):
    order_id: str
    amount_paise: int
    currency: str = 'INR'
    key_id: str
    plan_label: str
    amount_usd: float


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# ----- Orders & Licenses -----
class Order(BaseModel):
    id: str = Field(default_factory=_id)
    user_id: str
    plan_id: str
    plan_name: str
    period: str
    amount_usd: float
    amount_paise: int
    razorpay_order_id: str
    razorpay_payment_id: Optional[str] = None
    status: str = 'created'  # created | paid | failed
    created_at: datetime = Field(default_factory=_now)


class License(BaseModel):
    id: str = Field(default_factory=_id)
    user_id: str
    plan_id: str
    plan_name: str
    period: str
    key: str  # human-readable license key
    api_key: str  # bearer token for API
    status: str = 'active'  # active | expired | revoked
    issued_at: datetime = Field(default_factory=_now)
    expires_at: datetime
    backtests_used: int = 0
    backtests_limit: int = 0


# ----- Backtest -----
class BacktestRequest(BaseModel):
    strategy: str = 'momentum_rsi_14'
    market: str = 'NASDAQ:AAPL'
    capital: float = 100000
    start: str = '2020-01-01'
    end: str = '2024-12-31'


class BacktestResult(BaseModel):
    run_id: str
    strategy: str
    market: str
    sharpe: float
    max_drawdown: float
    trades: int
    net_pnl: float
    duration_ms: int
    equity_curve: List[float]
    license_id: str
    created_at: datetime = Field(default_factory=_now)
