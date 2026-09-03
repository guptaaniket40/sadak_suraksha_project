from typing import Optional
from fastapi import status

from src.services.resolved_reports.schema import ResolvedReportsSchema
from src.services.reports.serializer import ReportResponseSerializer
from src.utils.response import response_structure
from src.utils.constant_strings import ResolvedReportConstants


class ResolvedReportsController:

    @staticmethod
    async def get_resolved_and_rejected(status_filter: Optional[str] = None):
        try:
            reports = await ResolvedReportsSchema.get_resolved_and_rejected(status_filter)
            return response_structure(
                status.HTTP_200_OK,
                True,
                "Reports fetched successfully.",
                {"reports": [ReportResponseSerializer.from_orm_model(r).to_dict() for r in reports]},
            )
        except Exception as e:
            return response_structure(
                status.HTTP_500_INTERNAL_SERVER_ERROR, False, ResolvedReportConstants.FETCH_FAILED, {"error": str(e)}
            )

    @staticmethod
    async def get_only_resolved():
        try:
            reports = await ResolvedReportsSchema.get_only_resolved()
            return response_structure(
                status.HTTP_200_OK,
                True,
                "Resolved reports fetched successfully.",
                {"reports": [ReportResponseSerializer.from_orm_model(r).to_dict() for r in reports]},
            )
        except Exception as e:
            return response_structure(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                False,
                ResolvedReportConstants.FETCH_RESOLVED_FAILED,
                {"error": str(e)},
            )
