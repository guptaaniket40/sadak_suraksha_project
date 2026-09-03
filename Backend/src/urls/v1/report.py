from typing import Optional
from fastapi import APIRouter, Depends, Form, File, UploadFile

from src.services.reports.controller import ReportController
from src.utils.jwt_auth import jwt_auth, TokenClaims

report_router = APIRouter(prefix="/api/report", tags=["Reports"])
myreport_router = APIRouter(prefix="/api/myReport", tags=["My Reports"])


@report_router.post("")
async def create_report(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    category: str = Form(...),
    priority: str = Form(...),
    image: Optional[UploadFile] = File(None),
    authorize: TokenClaims = Depends(jwt_auth),
):
    return await ReportController.create_report(
        title=title,
        description=description,
        location=location,
        category=category,
        priority=priority,
        user_id=authorize.id,
        image=image,
    )


@report_router.get("/status-counts")
async def get_status_counts(authorize: TokenClaims = Depends(jwt_auth)):
    return await ReportController.get_status_counts()


@myreport_router.get("")
async def get_my_reports(authorize: TokenClaims = Depends(jwt_auth)):
    return await ReportController.get_my_reports(authorize.id)
