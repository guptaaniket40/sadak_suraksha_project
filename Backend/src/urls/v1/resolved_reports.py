from typing import Optional
from fastapi import APIRouter, Query

from src.services.resolved_reports.controller import ResolvedReportsController

router = APIRouter(prefix="/api/resolved-reports", tags=["Resolved Reports"])


@router.get("")
async def get_resolved_and_rejected_reports(status: Optional[str] = Query(None)):
    return await ResolvedReportsController.get_resolved_and_rejected(status)


@router.get("/onlyresolved")
async def get_only_resolved_reports():
    return await ResolvedReportsController.get_only_resolved()
