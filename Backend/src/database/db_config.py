from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import make_url
from dotenv import load_dotenv

from src.database.config import Config
from src.database.models import Base

load_dotenv()


class AsyncDatabaseSession:
    """
    Thin async DB session wrapper.
    """

    def __init__(self):
        self._session = None
        self._engine = None

    def __getattr__(self, name):
        return getattr(self._session, name)

    def init(self):
        connect_args = {}
        db_url = Config.DB_CONFIG

        if db_url.startswith("sqlite"):
            connect_args = {"check_same_thread": False}

        elif db_url.startswith("postgresql+asyncpg://"):
            # Remove libpq-style sslmode from the URL because
            # asyncpg does not accept sslmode as a connection argument.
            db_url = make_url(db_url).difference_update_query(["sslmode"])

            # asyncpg uses "ssl" instead.
            connect_args = {"ssl": True}

        self._engine = create_async_engine(
            db_url,
            future=True,
            echo=False,
            connect_args=connect_args,
        )

        self._session = sessionmaker(
            self._engine,
            expire_on_commit=False,
            class_=AsyncSession
        )()

    async def create_all(self):
        async with self._engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def close(self):
        if self._session is not None:
            await self._session.close()


db = AsyncDatabaseSession()