from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/books", tags=["books"])


@router.get("/search", response_model=List[schemas.BookOut])
def search_books(q: Optional[str] = "", db: Session = Depends(get_db)):
    """
    Search for books by title, author name, or publication year.
    If multiple books match these criteria, all of them will appear in the results.
    """
    query = db.query(models.Book)
    if q:
        like_pattern = f"%{q}%"
        query = query.filter(
            or_(
                models.Book.title.like(like_pattern),
                models.Book.author.like(like_pattern),
                models.Book.publish_year.like(like_pattern),
            )
        )
    books = query.order_by(models.Book.title).all()
    return books


@router.post("/{book_id}/borrow", response_model=schemas.BorrowRecordOut)
def borrow_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="کتاب مورد نظر پیدا نشد.")
    if not book.is_available:
        raise HTTPException(status_code=400, detail="این کتاب در حال حاضر موجود نیست.")

    # We prevent the action if the user has already borrowed the same book and not returned it (unexpected scenario).
    existing = (
        db.query(models.BorrowRecord)
        .filter(
            models.BorrowRecord.book_id == book_id,
            models.BorrowRecord.status == models.BorrowStatus.borrowed,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="این کتاب هم‌اکنون توسط کاربر دیگری امانت گرفته شده است.")

    record = models.BorrowRecord(
        user_id=current_user.id,
        book_id=book.id,
        status=models.BorrowStatus.borrowed,
    )
    book.is_available = False

    db.add(record)
    db.commit()
    db.refresh(record)
    return record
