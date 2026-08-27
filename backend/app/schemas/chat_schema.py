from pydantic import BaseModel, Field
from typing import List, Literal


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=2000,
        description="The traveller's latest question."
    )
    history: List[ChatMessage] = Field(
        default_factory=list,
        max_length=20,
        description="Earlier turns, oldest first. Sent by the client - the API keeps no state."
    )


class ChatResponse(BaseModel):
    reply: str
