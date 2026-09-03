from typing import Optional
from pydantic import BaseModel

from src.database.config import AllEnum


class StatusUpdateSerializer(BaseModel):
    status: AllEnum.ReportStatusEnum


class RemarksUpdateSerializer(BaseModel):
    remarks: Optional[str] = ""
