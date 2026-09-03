import httpx
from fastapi import status

from src.database.config import Config
from src.services.chatbot.serializer import ChatMessageSerializer
from src.utils.response import response_structure
from src.utils.constant_strings import ChatbotConstants


class ChatbotController:

    @staticmethod
    async def send_message(payload: ChatMessageSerializer):
        if not payload.message or not payload.message.strip():
            return response_structure(status.HTTP_400_BAD_REQUEST, False, ChatbotConstants.MESSAGE_REQUIRED)

        if not Config.OPENROUTER_API_KEY:
            return response_structure(
                status.HTTP_200_OK, True, "OK", {"response": ChatbotConstants.FALLBACK_NO_KEY}
            )

        request_body = {
            "model": Config.OPENROUTER_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are Sadak Suraksha AI assistant, an intelligent and polite assistant "
                        "helping citizens report road damages, potholes, traffic signal issues, "
                        "and check complaint status in India."
                    ),
                },
                {"role": "user", "content": payload.message},
            ],
            "temperature": 0.7,
            "max_tokens": 500,
        }

        candidate_models = [Config.OPENROUTER_MODEL, "liquid/lfm-2.5-2.6b:free", "minimax/minimax-m2.7:free", "nvidia/nemotron-3.5-lightning:free"]
        # Remove duplicates while preserving order
        candidate_models = list(dict.fromkeys([m for m in candidate_models if m]))

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {Config.OPENROUTER_API_KEY}",
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
                                or "Sorry, I could not generate a response."
                            )
                            # Remove think tags if any
                            import re
                            bot_reply = re.sub(r"<think>.*?</think>", "", bot_reply, flags=re.DOTALL).strip()
                            if bot_reply:
                                return response_structure(status.HTTP_200_OK, True, "OK", {"response": bot_reply})
                    except Exception:
                        continue

                return response_structure(
                    status.HTTP_200_OK, True, "OK", {"response": ChatbotConstants.SERVER_ERROR}
                )

        except Exception:
            return response_structure(status.HTTP_200_OK, True, "OK", {"response": ChatbotConstants.GENERIC_ERROR})

