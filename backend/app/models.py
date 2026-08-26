from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum, text
from sqlalchemy.orm import relationship

import enum

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    national_code = Column(String(20), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)

    borrow_records = relationship("BorrowRecord", back_populates="user")


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False, index=True)
    author = Column(String(255), nullable=False, index=True)
    publish_year = Column(String(10), nullable=False, index=True)
    is_available = Column(Boolean, default=True, nullable=False)

    borrow_records = relationship("BorrowRecord", back_populates="book")


class BorrowStatus(str, enum.Enum):
    borrowed = "borrowed"
    returned = "returned"


class BorrowRecord(Base):
    __tablename__ = "borrow_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    borrow_date = Column(DateTime(timezone=True), server_default=text('CURRENT_TIMESTAMP'))
    return_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(Enum(BorrowStatus), default=BorrowStatus.borrowed, nullable=False)

    user = relationship("User", back_populates="borrow_records")
    book = relationship("Book", back_populates="borrow_records")
