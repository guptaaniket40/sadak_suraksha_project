import os
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
        clean_key = api_key.strip().strip('"').strip("'")
        if not clean_key:
            return ""

        models = [
            "gemini-3.6-flash",
            "gemini-3.5-flash",
            "gemini-3.1-flash-lite",
            "gemini-3.7-flash",
        ]
        for model in models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={clean_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"{SYSTEM_PROMPT}\n\nUser Question: {message}"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 600
                }
            }
            try:
                async with httpx.AsyncClient(timeout=4.5) as client:
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
                    else:
                        print(f"[Chatbot] Gemini API error ({model}): {resp.status_code} - {resp.text}")
            except Exception as e:
                print(f"[Chatbot] Gemini request exception ({model}): {e}")
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
    def _get_fallback_knowledge_response(message: str) -> str:
        msg = message.lower().strip()

        # Pothole or reporting complaint
        if any(k in msg for k in ["pothole", "gaddha", "complaint", "report", "kaise karein", "how to report", "damage", "sadak", "road"]):
            return (
                "📍 **Pothole / Road Damage Complaint Kaise Karein:**\n\n"
                "1. **'Report Hazard'** tab par click karein.\n"
                "2. Sadak samasya ki photo upload karein.\n"
                "3. Location / GPS auto-detect hone dein ya manual address enter karein.\n"
                "4. Category select karein (e.g., Pothole, Broken Signal, Waterlogging) aur **Submit** par click karein!\n\n"
                "Aapki complaint turant local authority dashboard par chali jayegi."
            )

        # Status tracking
        if any(k in msg for k in ["status", "track", "check", "kahan pahuchi", "my reports", "meri report"]):
            return (
                "📊 **Report Status Check Karne Ka Tarika:**\n\n"
                "1. Website ke top navigation menu me **'My Reports'** par click karein.\n"
                "2. Wahan aapko aapki sabhi complaints ka live stage status dikhega:\n"
                "   - 🟡 **Submitted** (Aapki complaint darz ho gayi hai)\n"
                "   - 🔵 **Under Review** (Authority janch kar rahi hai)\n"
                "   - 🟠 **In Progress** (Kam shuru ho chuka hai)\n"
                "   - 🟢 **Resolved** (Samasya theek ho chuki hai)\n"
                "3. Resolve hone par authority ki proof photo aur remarks bhi wahan milenge."
            )

        # Emergency helplines
        if any(k in msg for k in ["emergency", "helpline", "number", "police", "ambulance", "accident"]):
            return (
                "🚨 **National Road Safety & Emergency Helpline Numbers (India):**\n\n"
                "- **National Highway Emergency:** 1033\n"
                "- **All-in-One Emergency Helpline:** 112\n"
                "- **Ambulance Service:** 108 / 102\n"
                "- **Traffic Police Helpline:** 1095 / 1073\n"
                "- **Women Safety Helpline:** 1091"
            )

        # General Greetings
        if any(k in msg for k in ["hi", "hello", "namaste", "hey", "help", "kya kar sakte"]):
            return (
                "Namaste! Main **Sadak Suraksha AI Assistant** hoon. 🙏\n\n"
                "Main aapki in cheezon mein madad kar sakta hoon:\n"
                "• Sadak ke gaddhe ya damage report karna\n"
                "• Apni complaint ka live status track karna\n"
                "• Traffic signal aur road safety helplines ki jaankari lena\n\n"
                "Aap apna sawal pooch sakte hain!"
            )

        return (
            "Sadak Suraksha par aap kisi bhi sadak samasya, pothole, ya broken traffic signal ki complaint darz kar sakte hain. "
            "Report karne ke liye 'Report Hazard' par jayein aur status check karne ke liye 'My Reports' open karein."
        )

    @staticmethod
    async def send_message(payload: ChatMessageSerializer):
        if not payload.message or not payload.message.strip():
            return response_structure(status.HTTP_400_BAD_REQUEST, False, ChatbotConstants.MESSAGE_REQUIRED)

        gemini_key = os.getenv("GEMINI_API_KEY", "") or Config.GEMINI_API_KEY
        openrouter_key = os.getenv("OPENROUTER_API_KEY", "") or Config.OPENROUTER_API_KEY

        # 1. Prioritize Google Gemini API
        if gemini_key:
            gemini_reply = await ChatbotController._call_gemini(payload.message, gemini_key)
            if gemini_reply:
                return response_structure(status.HTTP_200_OK, True, "OK", {"response": gemini_reply})

        # 2. Fallback to OpenRouter
        if openrouter_key:
            openrouter_reply = await ChatbotController._call_openrouter(payload.message, openrouter_key)
            if openrouter_reply:
                return response_structure(status.HTTP_200_OK, True, "OK", {"response": openrouter_reply})

        # 3. Graceful offline knowledge assistant fallback
        fallback_reply = ChatbotController._get_fallback_knowledge_response(payload.message)
        return response_structure(status.HTTP_200_OK, True, "OK", {"response": fallback_reply})

