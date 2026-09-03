from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from src.database.config import Config
from src.database.models import Base

load_dotenv()


class AsyncDatabaseSession:
    """
    Thin async DB session wrapper, same pattern as minestone's
    AsyncDatabaseSession: a single shared session whose attributes
    (execute/add/commit/refresh, etc.) are proxied via __getattr__.
    """

    def __init__(self):
        self._session = None
        self._engine = None

    def __getattr__(self, name):
        return getattr(self._session, name)

    def init(self):
        connect_args = {}
        if Config.DB_CONFIG.startswith("sqlite"):
            connect_args = {"check_same_thread": False}

        self._engine = create_async_engine(
            Config.DB_CONFIG,
            future=True,
            echo=False,
            connect_args=connect_args,
        )
        self._session = sessionmaker(
            self._engine, expire_on_commit=False, class_=AsyncSession
        )()

    async def create_all(self):
        async with self._engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def close(self):
        if self._session is not None:
            await self._session.close()


db = AsyncDatabaseSession()
