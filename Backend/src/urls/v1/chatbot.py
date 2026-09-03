from fastapi import APIRouter

from src.services.chatbot.controller import ChatbotController
from src.services.chatbot.serializer import ChatMessageSerializer

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])


@router.post("/message")
async def chat_message(payload: ChatMessageSerializer):
    return await ChatbotController.send_message(payload)
