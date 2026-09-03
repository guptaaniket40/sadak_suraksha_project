from typing import Optional
from fastapi import status, UploadFile

from src.services.reports.schema import ReportSchema
from src.services.reports.serializer import ReportResponseSerializer
from src.utils.file_storage import save_upload_file
from src.utils.response import response_structure
from src.utils.constant_strings import ReportConstants


class ReportController:

    @staticmethod
    async def create_report(
        title: str,
        description: str,
        location: str,
        category: str,
        priority: str,
        user_id: str,
        image: Optional[UploadFile] = None,
    ):
        try:
            image_url = ""
            if image and image.filename:
                image_url = await save_upload_file(image)

            report = await ReportSchema.create_report(
                title=title,
                description=description,
                location=location,
                category=category,
                priority=priority,
                image_url=image_url,
                user_id=user_id,
            )

            return response_structure(
                status.HTTP_201_CREATED,
                True,
                ReportConstants.CREATE_SUCCESS,
                {"report": ReportResponseSerializer.from_orm_model(report).to_dict()},
            )
        except Exception as e:
            return response_structure(
                status.HTTP_500_INTERNAL_SERVER_ERROR, False, ReportConstants.CREATE_FAILED, {"error": str(e)}
            )

    @staticmethod
    async def get_my_reports(user_id: str):
        try:
            reports = await ReportSchema.get_reports_by_user(user_id)
            return response_structure(
                status.HTTP_200_OK,
                True,
                "Reports fetched successfully.",
                {"reports": [ReportResponseSerializer.from_orm_model(r).to_dict() for r in reports]},
            )
        except Exception as e:
            return response_structure(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                False,
                ReportConstants.FETCH_MY_REPORTS_FAILED,
                {"error": str(e)},
            )

    @staticmethod
    async def get_status_counts():
        try:
            resolved_count, rejected_count = await ReportSchema.get_status_counts()
            return response_structure(
                status.HTTP_200_OK,
                True,
                "Status counts fetched successfully.",
                {"Resolved": resolved_count, "Rejected": rejected_count},
            )
        except Exception as e:
            return response_structure(
                status.HTTP_500_INTERNAL_SERVER_ERROR, False, ReportConstants.STATUS_COUNTS_FAILED, {"error": str(e)}
            )
