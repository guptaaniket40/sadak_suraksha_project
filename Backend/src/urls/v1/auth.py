from fastapi import APIRouter

from src.services.auth.controller import AuthController
from src.services.auth.serializer import RegisterSerializer, LoginSerializer

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register")
async def register(payload: RegisterSerializer):
    return await AuthController.register(payload)


@router.post("/login")
async def login(payload: LoginSerializer):
    return await AuthController.login(payload)
