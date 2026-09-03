from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.database.db_config import db
from src.database.models import Report


class ResolvedReportsSchema:

    @staticmethod
    async def get_resolved_and_rejected(status_filter: Optional[str] = None):
        query = select(Report).options(selectinload(Report.user))

        if status_filter in ("Resolved", "Rejected"):
            query = query.where(Report.status == status_filter)
        else:
            query = query.where(Report.status.in_(["Resolved", "Rejected"]))

        query = query.order_by(Report.created_at.desc())
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def get_only_resolved():
        result = await db.execute(
            select(Report)
            .options(selectinload(Report.user))
            .where(Report.status == "Resolved")
            .order_by(Report.created_at.desc())
        )
        return result.scalars().all()
