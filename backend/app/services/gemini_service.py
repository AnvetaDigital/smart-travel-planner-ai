from google import genai

from app.core.config import settings


class GeminiService:

    @staticmethod
    def generate_itinerary(prompt: str) -> str:
        client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return response.text