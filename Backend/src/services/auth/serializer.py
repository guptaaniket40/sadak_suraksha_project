from typing import Optional
from pydantic import BaseModel, Field

from src.database.config import AllEnum


class RegisterSerializer(BaseModel):
    email: str
    username: str
    password: str
    role: Optional[AllEnum.RoleEnum] = AllEnum.RoleEnum.USER


class LoginSerializer(BaseModel):
    email: str
    password: str
    role: Optional[AllEnum.RoleEnum] = AllEnum.RoleEnum.USER


class AuthResponseSerializer(BaseModel):
    token: str
