import re
import httpx
from fastapi import status

from src.database.config import Config
from src.services.chatbot.serializer import ChatMessageSerializer
from src.utils.response import response_structure
from src.utils.constant_strings import ChatbotConstants

SYSTEM_PROMPT = (
    "You are Sadak Suraksha AI assistant, an intelligent and polite assistant "
    "helping citizens report road damages, potholes, traffic signal issues, "
    "and check complaint status in India. Keep answers helpful, clear, and concise."
)


class ChatbotController:

    @staticmethod
    async def _call_gemini(message: str, api_key: str) -> str:
        models = ["gemini-2.0-flash", "gemini-1.5-flash"]
        for model in models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            payload = {
                "system_instruction": {
                    "parts": [{"text": SYSTEM_PROMPT}]
                },
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": message}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 600
                }
            }
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts and "text" in parts[0]:
                                text = parts[0]["text"].strip()
                                text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
                                if text:
                                    return text
            except Exception as e:
                print(f"Gemini API error ({model}): {e}")
                continue
        return ""

    @staticmethod
    async def _call_openrouter(message: str, api_key: str) -> str:
        candidate_models = [Config.OPENROUTER_MODEL, "liquid/lfm-2.5-2.6b:free", "minimax/minimax-m2.7:free", "nvidia/nemotron-3.5-lightning:free"]
        candidate_models = list(dict.fromkeys([m for m in candidate_models if m]))

        request_body = {
            "model": Config.OPENROUTER_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": message},
            ],
            "temperature": 0.7,
            "max_tokens": 500,
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                for model_name in candidate_models:
                    request_body["model"] = model_name
                    try:
                        api_response = await client.post(Config.OPENROUTER_URL, json=request_body, headers=headers)
                        if api_response.status_code == 200:
                            result = api_response.json()
                            bot_reply = (
                                result.get("choices", [{}])[0].get("message", {}).get("content")
                                or result.get("response")
                                or ""
                            )
                            bot_reply = re.sub(r"<think>.*?</think>", "", bot_reply, flags=re.DOTALL).strip()
                            if bot_reply:
                                return bot_reply
                    except Exception:
                        continue
        except Exception:
            pass
        return ""

    @staticmethod
    async def send_message(payload: ChatMessageSerializer):
        if not payload.message or not payload.message.strip():
            return response_structure(status.HTTP_400_BAD_REQUEST, False, ChatbotConstants.MESSAGE_REQUIRED)

        # 1. Prioritize Google Gemini API
        if Config.GEMINI_API_KEY:
            gemini_reply = await ChatbotController._call_gemini(payload.message, Config.GEMINI_API_KEY)
            if gemini_reply:
                return response_structure(status.HTTP_200_OK, True, "OK", {"response": gemini_reply})

        # 2. Fallback to OpenRouter
        if Config.OPENROUTER_API_KEY:
            openrouter_reply = await ChatbotController._call_openrouter(payload.message, Config.OPENROUTER_API_KEY)
            if openrouter_reply:
                return response_structure(status.HTTP_200_OK, True, "OK", {"response": openrouter_reply})

        if not Config.GEMINI_API_KEY and not Config.OPENROUTER_API_KEY:
            return response_structure(
                status.HTTP_200_OK, True, "OK", {"response": ChatbotConstants.FALLBACK_NO_KEY}
            )

        return response_structure(
            status.HTTP_200_OK, True, "OK", {"response": ChatbotConstants.SERVER_ERROR}
        )

