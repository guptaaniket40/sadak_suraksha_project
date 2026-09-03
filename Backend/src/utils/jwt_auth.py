from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import Header, HTTPException, status, Depends

from src.database.config import Config
from src.utils.constant_strings import JWTConstants


class TokenClaims:
    """Decoded token payload, exposed as attributes (mirrors minestone's TokenClaims)."""

    def __init__(self, id: str, role: str = "user"):
        self.id = id
        self.role = role

    @property
    def user_id(self) -> str:
        return self.id


class JWTAuth:
    """
    HS256 JWT issuer/verifier. Kept as HS256 (not migrated to RS256) per
    project requirements, but exposed with the same class-based,
    dependency-callable shape as minestone's jwt_auth.
    """

    def __init__(self, secret_key: str, algorithm: str = "HS256", expiration_minutes: int = 1440):
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.expiration_minutes = expiration_minutes

    def generate_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=self.expiration_minutes))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def decode_token(self, token: str) -> dict:
        try:
            return jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"message": JWTConstants.JWT_EXPIRE})
        except jwt.PyJWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"message": JWTConstants.JWT_INVALID})

    def __call__(self, authorization: Optional[str] = Header(None)) -> TokenClaims:
        """Usable directly as a FastAPI dependency: Depends(jwt_auth)."""
        if not authorization:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"message": JWTConstants.JWT_MISSING})

        token = authorization.replace("Bearer ", "").strip()
        payload = self.decode_token(token)

        user_id = payload.get("id")
        role = payload.get("role", "user")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"message": JWTConstants.JWT_INVALID})

        return TokenClaims(id=user_id, role=role)


jwt_auth = JWTAuth(
    secret_key=Config.JWT_SECRET,
    algorithm=Config.JWT_ALGORITHM,
    expiration_minutes=Config.JWT_EXPIRATION_MINUTES,
)


def require_admin(authorize: TokenClaims = Depends(jwt_auth)) -> TokenClaims:
    """Secondary dependency layered on top of jwt_auth for admin-only routes."""
    if authorize.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"message": JWTConstants.ADMIN_ONLY})
    return authorize
