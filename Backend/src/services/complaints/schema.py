from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.database.db_config import db
from src.database.models import Report

PRIORITY_ORDER = {"High": 1, "Medium": 2, "Low": 3}


class ComplaintsSchema:

    @staticmethod
    async def get_all_reports():
        result = await db.execute(select(Report).options(selectinload(Report.user)))
        reports = result.scalars().all()
        return sorted(reports, key=lambda r: PRIORITY_ORDER.get(r.priority, 99))

    @staticmethod
    async def get_report_by_id(report_id: str):
        result = await db.execute(
            select(Report).options(selectinload(Report.user)).where(Report.id == report_id)
        )
        return result.scalars().first()

    @staticmethod
    async def save(report: Report) -> Report:
        await db.commit()
        await db.refresh(report)
        return await ComplaintsSchema.get_report_by_id(report.id)
