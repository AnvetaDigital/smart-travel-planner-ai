from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    fullName: str = Field(
        min_length=2,
        max_length=120,
        description="The traveller's display name."
    )
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=128,
        description="Plain password - hashed before it is ever stored."
    )


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserResponse(BaseModel):
    """Public view of a user. Never carries the password hash."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    fullName: str = Field(validation_alias="full_name")


class MessageResponse(BaseModel):
    message: str
