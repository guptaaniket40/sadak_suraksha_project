from sqlalchemy import select

from src.database.db_config import db
from src.database.models import User, Admin
from src.database.config import AllEnum


class AuthSchema:
    """DB access layer for authentication. Picks the User or Admin table
    based on the requested role, same way the original routers did."""

    @staticmethod
    def _model_for_role(role: str):
        return Admin if role == AllEnum.RoleEnum.ADMIN.value else User

    @staticmethod
    async def get_account_by_email(email: str, role: str):
        model = AuthSchema._model_for_role(role)
        result = await db.execute(select(model).where(model.email == email))
        return result.scalars().first()

    @staticmethod
    async def get_account_by_username(username: str, role: str):
        model = AuthSchema._model_for_role(role)
        result = await db.execute(select(model).where(model.username == username))
        return result.scalars().first()

    @staticmethod
    async def create_account(email: str, username: str, hashed_password: str, role: str):
        model = AuthSchema._model_for_role(role)
        account = model(email=email, username=username, password=hashed_password)
        db.add(account)
        await db.commit()
        await db.refresh(account)
        return account
