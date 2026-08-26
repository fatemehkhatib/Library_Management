from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=schemas.UserOut)
def get_profile(current_user: models.User = Depends(auth.get_current_user)):
    """User details: Full name and National ID number"""
    return current_user


@router.get("/me/history", response_model=List[schemas.BorrowRecordOut])
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """Borrowing history: List of all books borrowed by the user, whether returned or not"""
    records = (
        db.query(models.BorrowRecord)
        .filter(models.BorrowRecord.user_id == current_user.id)
        .order_by(models.BorrowRecord.borrow_date.desc())
        .all()
    )
    return records


@router.post("/me/history/{record_id}/return", response_model=schemas.BorrowRecordOut)
def return_book(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """Return book: Update record status to 'returned' and make the book available again"""
    from datetime import datetime

    record = (
        db.query(models.BorrowRecord)
        .filter(
            models.BorrowRecord.id == record_id,
            models.BorrowRecord.user_id == current_user.id,
        )
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="سابقه امانتی مورد نظر پیدا نشد.")
    if record.status == models.BorrowStatus.returned:
        raise HTTPException(status_code=400, detail="این کتاب قبلا پس داده شده است.")

    record.status = models.BorrowStatus.returned
    record.return_date = datetime.utcnow()
    record.book.is_available = True

    db.commit()
    db.refresh(record)
    return record
