

import uuid
from pydantic import BaseModel

class UserBase(BaseModel):
    id:uuid.UUID
    email: str
    user_name: str
    created_at: str
    updated_at: str

class UserCreate(BaseModel):
    email: str
    user_name: str
    password_hash: str

