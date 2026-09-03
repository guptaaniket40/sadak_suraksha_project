from datetime import datetime
from typing import Optional, Any, List
from pydantic import BaseModel, Field


class UserSummarySerializer(BaseModel):
    id: Optional[str] = None
    mongo_id: Optional[str] = Field(default=None, serialization_alias="_id", validation_alias="_id")
    username: str

    class Config:
        from_attributes = True
        populate_by_name = True


class ReportResponseSerializer(BaseModel):
    id: str
    mongo_id: str = Field(default="", serialization_alias="_id", validation_alias="_id")
    title: str
    description: str
    location: str
    category: str
    priority: str
    status: str
    imageUrl: Optional[str] = ""
    adminImageUrl: Optional[str] = ""
    adminRemarks: Optional[str] = ""
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    user: Optional[UserSummarySerializer] = None

    class Config:
        from_attributes = True
        populate_by_name = True

    @classmethod
    def from_orm_model(cls, obj: Any) -> "ReportResponseSerializer":
        user_summary = None
        if getattr(obj, "user", None):
            user_summary = UserSummarySerializer(
                id=str(obj.user.id),
                mongo_id=str(obj.user.id),
                username=obj.user.username,
            )

        return cls(
            id=str(obj.id),
            mongo_id=str(obj.id),
            title=obj.title or "",
            description=obj.description or "",
            location=obj.location or "",
            category=obj.category or "",
            priority=obj.priority or "Low",
            status=obj.status or "Submitted",
            imageUrl=obj.image_url or "",
            adminImageUrl=obj.admin_image_url or "",
            adminRemarks=obj.admin_remarks or "",
            createdAt=obj.created_at,
            updatedAt=obj.updated_at,
            user=user_summary,
        )

    def to_dict(self) -> dict:
        return self.model_dump(by_alias=True)


class ReportListSerializer(BaseModel):
    reports: List[ReportResponseSerializer]

    class Config:
        populate_by_name = True


class StatusCountsSerializer(BaseModel):
    Resolved: int
    Rejected: int
