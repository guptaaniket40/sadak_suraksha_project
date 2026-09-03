from fastapi import status, UploadFile

from src.services.complaints.schema import ComplaintsSchema
from src.services.complaints.serializer import StatusUpdateSerializer, RemarksUpdateSerializer
from src.services.reports.serializer import ReportResponseSerializer
from src.utils.file_storage import save_upload_file
from src.utils.response import response_structure
from src.utils.constant_strings import ComplaintConstants, ReportConstants


class ComplaintsController:

    @staticmethod
    async def get_all_complaints():
        try:
            reports = await ComplaintsSchema.get_all_reports()
            return response_structure(
                status.HTTP_200_OK,
                True,
                "Complaints fetched successfully.",
                {"reports": [ReportResponseSerializer.from_orm_model(r).to_dict() for r in reports]},
            )
        except Exception as e:
            return response_structure(
                status.HTTP_500_INTERNAL_SERVER_ERROR, False, ComplaintConstants.FETCH_FAILED, {"error": str(e)}
            )

    @staticmethod
    async def update_status(report_id: str, payload: StatusUpdateSerializer):
        report = await ComplaintsSchema.get_report_by_id(report_id)
        if not report:
            return response_structure(status.HTTP_404_NOT_FOUND, False, ReportConstants.NOT_FOUND)

        report.status = payload.status.value if hasattr(payload.status, "value") else payload.status
        updated_report = await ComplaintsSchema.save(report)

        return response_structure(
            status.HTTP_200_OK,
            True,
            ComplaintConstants.STATUS_UPDATED,
            {"report": ReportResponseSerializer.from_orm_model(updated_report).to_dict()},
        )

    @staticmethod
    async def reject_report(report_id: str):
        report = await ComplaintsSchema.get_report_by_id(report_id)
        if not report:
            return response_structure(status.HTTP_404_NOT_FOUND, False, ReportConstants.NOT_FOUND)

        report.status = "Rejected"
        updated_report = await ComplaintsSchema.save(report)

        return response_structure(
            status.HTTP_200_OK,
            True,
            ComplaintConstants.REJECTED,
            {"report": ReportResponseSerializer.from_orm_model(updated_report).to_dict()},
        )

    @staticmethod
    async def upload_admin_image(report_id: str, admin_image: UploadFile):
        report = await ComplaintsSchema.get_report_by_id(report_id)
        if not report:
            return response_structure(status.HTTP_404_NOT_FOUND, False, ReportConstants.NOT_FOUND)

        try:
            image_url = await save_upload_file(admin_image)
            report.admin_image_url = image_url
            updated_report = await ComplaintsSchema.save(report)

            return response_structure(
                status.HTTP_200_OK,
                True,
                ComplaintConstants.IMAGE_UPLOADED,
                {"report": ReportResponseSerializer.from_orm_model(updated_report).to_dict()},
            )
        except Exception as e:
            return response_structure(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                False,
                ComplaintConstants.IMAGE_UPLOAD_FAILED,
                {"error": str(e)},
            )

    @staticmethod
    async def update_admin_remarks(report_id: str, payload: RemarksUpdateSerializer):
        report = await ComplaintsSchema.get_report_by_id(report_id)
        if not report:
            return response_structure(status.HTTP_404_NOT_FOUND, False, ReportConstants.NOT_FOUND)

        report.admin_remarks = payload.remarks or ""
        updated_report = await ComplaintsSchema.save(report)

        return response_structure(
            status.HTTP_200_OK,
            True,
            ComplaintConstants.REMARKS_UPDATED,
            {"adminRemarks": updated_report.admin_remarks},
        )
