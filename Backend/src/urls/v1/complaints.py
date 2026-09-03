from fastapi import APIRouter, Depends, UploadFile, File

from src.services.complaints.controller import ComplaintsController
from src.services.complaints.serializer import StatusUpdateSerializer, RemarksUpdateSerializer
from src.utils.jwt_auth import require_admin, TokenClaims

router = APIRouter(prefix="/api/complaints", tags=["Complaints (Admin)"])


@router.get("")
async def get_all_complaints(admin: TokenClaims = Depends(require_admin)):
    return await ComplaintsController.get_all_complaints()


@router.patch("/{id}/status")
async def update_report_status(id: str, payload: StatusUpdateSerializer, admin: TokenClaims = Depends(require_admin)):
    return await ComplaintsController.update_status(id, payload)


@router.patch("/{id}/reject")
async def reject_report(id: str, admin: TokenClaims = Depends(require_admin)):
    return await ComplaintsController.reject_report(id)


@router.post("/{id}/admin-image")
async def upload_admin_image(id: str, adminImage: UploadFile = File(...), admin: TokenClaims = Depends(require_admin)):
    return await ComplaintsController.upload_admin_image(id, adminImage)


@router.patch("/{id}/admin-remarks")
async def update_admin_remarks(id: str, payload: RemarksUpdateSerializer, admin: TokenClaims = Depends(require_admin)):
    return await ComplaintsController.update_admin_remarks(id, payload)
