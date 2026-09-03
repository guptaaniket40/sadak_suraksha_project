from typing import Optional
from pydantic import BaseModel


class ChatMessageSerializer(BaseModel):
    message: str
    sessionId: Optional[str] = None
