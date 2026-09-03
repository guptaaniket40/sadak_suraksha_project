from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from src.database.db_config import db
from src.database.models import Report


class ReportSchema:

    @staticmethod
    async def create_report(**fields) -> Report:
        report = Report(**fields, status="Submitted")
        db.add(report)
        await db.commit()
        await db.refresh(report)
        # Reload with the `user` relation eagerly loaded so the async
        # session can safely serialize it (no lazy-load in async mode).
        return await ReportSchema.get_report_with_user(report.id)

    @staticmethod
    async def get_report_with_user(report_id: str):
        result = await db.execute(
            select(Report).options(selectinload(Report.user)).where(Report.id == report_id)
        )
        return result.scalars().first()

    @staticmethod
    async def get_reports_by_user(user_id: str):
        result = await db.execute(
            select(Report)
            .options(selectinload(Report.user))
            .where(Report.user_id == user_id)
            .order_by(Report.created_at.desc())
        )
        return result.scalars().all()

    @staticmethod
    async def get_status_counts():
        resolved_result = await db.execute(
            select(func.count()).select_from(Report).where(Report.status == "Resolved")
        )
        rejected_result = await db.execute(
            select(func.count()).select_from(Report).where(Report.status == "Rejected")
        )
        return resolved_result.scalar() or 0, rejected_result.scalar() or 0
