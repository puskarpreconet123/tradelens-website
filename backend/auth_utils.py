from datetime import datetime, timedelta, timezone
from typing import Optional
import os
import bcrypt
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

JWT_SECRET = os.environ.get('JWT_SECRET', 'dev-secret')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRY_HOURS = int(os.environ.get('JWT_EXPIRY_HOURS', '168'))

bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        'sub': user_id,
        'email': email,
        'iat': int(now.timestamp()),
        'exp': int((now + timedelta(hours=JWT_EXPIRY_HOURS)).timestamp()),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        return None


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
):
    # Lazy-import db to avoid circular import
    from server import db
    if not credentials:
        raise HTTPException(status_code=401, detail='Not authenticated')
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail='Invalid or expired token')
    user = await db.users.find_one({'id': payload.get('sub')})
    if not user:
        raise HTTPException(status_code=401, detail='User not found')
    return user
