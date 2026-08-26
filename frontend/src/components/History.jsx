import { useState } from "react";
import { returnBook, borrowBook } from "../api/library";

export default function History({ records, onChanged }) {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const handleReturn = async (recordId) => {
    setMessage(null);
    setError(null);
    setBusyId(recordId);
    try {
      await returnBook(recordId);
      setMessage("عملیات با موفقیت انجام شد.");
      onChanged();
    } catch (err) {
      setError(err?.response?.data?.detail || "عملیات با خطا مواجه شد.");
    } finally {
      setBusyId(null);
    }
  };

  const handleBorrowAgain = async (bookId, bookIsAvailable) => {
    setMessage(null);
    setError(null);
    if (!bookIsAvailable) {
      setError("این کتاب در حال حاضر توسط شخص دیگری امانت گرفته شده است.");
      return;
    }
    setBusyId(bookId);
    try {
      await borrowBook(bookId);
      setMessage("عملیات با موفقیت انجام شد.");
      onChanged();
    } catch (err) {
      setError(err?.response?.data?.detail || "عملیات با خطا مواجه شد.");
    } finally {
      setBusyId(null);
    }
  };

  if (records.length === 0) {
    return <p className="empty-state">تا کنون کتابی امانت نگرفته‌اید.</p>;
  }

  return (
    <div className="history">
      <h2>تاریخچه امانت‌ها</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <ul className="book-list">
        {records.map((record) => (
          <li key={record.id} className="book-card">
            <div className="book-info">
              <h3>{record.book.title}</h3>
              <p>نویسنده: {record.book.author}</p>
              <p>سال انتشار: {record.book.publish_year}</p>
              <p>
                تاریخ دریافت: {new Date(record.borrow_date).toLocaleDateString("fa-IR")}
              </p>
              {record.return_date && (
                <p>
                  تاریخ بازگشت: {new Date(record.return_date).toLocaleDateString("fa-IR")}
                </p>
              )}
              <span
                className={
                  record.status === "borrowed" ? "badge unavailable" : "badge available"
                }
              >
                {record.status === "borrowed" ? "پس داده نشده" : "پس داده شده"}
              </span>
            </div>

            {record.status === "borrowed" ? (
              <button
                className="borrow-btn"
                disabled={busyId === record.id}
                onClick={() => handleReturn(record.id)}
              >
                {busyId === record.id ? "در حال ثبت..." : "پس دادن کتاب"}
              </button>
            ) : (
              <button
                className="borrow-btn"
                disabled={busyId === record.book.id}
                onClick={() => handleBorrowAgain(record.book.id, record.book.is_available)}
              >
                {busyId === record.book.id ? "در حال ثبت..." : "گرفتن دوباره این کتاب"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
