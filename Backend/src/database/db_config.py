from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import make_url
from sqlalchemy.exc import DBAPIError, InterfaceError
from dotenv import load_dotenv

from src.database.config import Config
from src.database.models import Base

load_dotenv()


class AsyncDatabaseSession:
    """
    Async database session wrapper.
    Designed for Neon PostgreSQL with connection recovery.
    """

    def __init__(self):
        self._session = None
        self._engine = None

    def __getattr__(self, name):
        return getattr(self._session, name)

    def init(self):
        connect_args = {}
        db_url = Config.DB_CONFIG

        # SQLite
        if db_url.startswith("sqlite"):
            connect_args = {
                "check_same_thread": False
            }

        # PostgreSQL + asyncpg
        elif db_url.startswith("postgresql+asyncpg://"):
            parsed_url = make_url(db_url)
            ssl_mode = parsed_url.query.get("sslmode", "")

            # asyncpg does not accept libpq-style sslmode
            # or channel_binding parameters.
            db_url = parsed_url.difference_update_query(
                ["sslmode", "channel_binding"]
            )

            is_local = parsed_url.host in ("localhost", "127.0.0.1", "::1", None)
            if ssl_mode in ("require", "verify-ca", "verify-full") or (not is_local and ssl_mode != "disable"):
                connect_args = {
                    "ssl": True
                }
            else:
                connect_args = {}

        self._engine = create_async_engine(
            db_url,
            future=True,
            echo=False,

            # Check stale connections before using them.
            pool_pre_ping=True,

            # Recycle connections periodically.
            # Helps with cloud PostgreSQL connections.
            pool_recycle=300,

            connect_args=connect_args,
        )

        self._session = sessionmaker(
            bind=self._engine,
            expire_on_commit=False,
            class_=AsyncSession,
        )()

    async def execute(self, statement, *args, **kwargs):
        """
        Execute a query and recover once if the current
        database connection has been closed.
        """
        try:
            return await self._session.execute(
                statement,
                *args,
                **kwargs,
            )

        except (InterfaceError, DBAPIError):
            # Clear the failed transaction/session state.
            try:
                await self._session.rollback()
            except Exception:
                pass

            # Retry the query using a fresh connection.
            return await self._session.execute(
                statement,
                *args,
                **kwargs,
            )

    async def create_all(self):
        """
        Create all database tables if they do not already exist.
        """
        async with self._engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def close(self):
        """
        Properly close the session and database engine.
        """
        if self._session is not None:
            await self._session.close()
            self._session = None

        if self._engine is not None:
            await self._engine.dispose()
            self._engine = None


db = AsyncDatabaseSession()