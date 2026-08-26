from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .models import BorrowStatus


# ---------- Auth ----------
class LoginRequest(BaseModel):
    national_code: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- User ----------
class UserOut(BaseModel):
    id: int
    full_name: str
    national_code: str

    class Config:
        from_attributes = True


# ---------- Book ----------
class BookOut(BaseModel):
    id: int
    title: str
    author: str
    publish_year: str
    is_available: bool

    class Config:
        from_attributes = True


# ---------- Borrow record ----------
class BorrowRecordOut(BaseModel):
    id: int
    book: BookOut
    borrow_date: datetime
    return_date: Optional[datetime] = None
    status: BorrowStatus

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    message: str
