import time

from fastapi import HTTPException
from google import genai
from google.genai import types

from app.core.config import settings
from app.schemas.trip_schema import Itinerary

_client = None

_MAX_ATTEMPTS = 3
_BACKOFF_SECONDS = 1.5
_RETRYABLE_CODES = ("503", "429", "500", "UNAVAILABLE", "RESOURCE_EXHAUSTED")


def _is_retryable(error: Exception) -> bool:
    message = str(error)

    return any(code in message for code in _RETRYABLE_CODES)


def _get_client() -> genai.Client:
    global _client

    if _client is None:
        if not settings.GEMINI_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="GEMINI_API_KEY is not configured on the server.",
            )

        _client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    return _client


class GeminiService:

    @staticmethod
    def generate_itinerary(
        prompt: str,
        system_instruction: str,
    ) -> Itinerary:
        client = _get_client()

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=Itinerary,
            temperature=0.9,
        )

        # Gemini returns transient 503s under load often enough that a single
        # attempt fails the request for reasons that clear in a second or two.
        last_error = None

        for attempt in range(_MAX_ATTEMPTS):
            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config=config,
                )
                break

            except Exception as e:
                last_error = e

                if not _is_retryable(e) or attempt == _MAX_ATTEMPTS - 1:
                    raise HTTPException(
                        status_code=502,
                        detail=f"Itinerary generation failed upstream: {e}",
                    )

                time.sleep(_BACKOFF_SECONDS * (2 ** attempt))

        else:
            raise HTTPException(
                status_code=502,
                detail=f"Itinerary generation failed upstream: {last_error}",
            )

        itinerary = response.parsed

        if not isinstance(itinerary, Itinerary):
            raise HTTPException(
                status_code=502,
                detail="Itinerary generation returned an unusable response.",
            )

        return itinerary
