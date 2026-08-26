export default function BookList({ books, onBorrow, borrowingId }) {
  if (books.length === 0) {
    return <p className="empty-state">کتابی با این مشخصات پیدا نشد.</p>;
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id} className="book-card">
          <div className="book-info">
            <h3>{book.title}</h3>
            <p>نویسنده: {book.author}</p>
            <p>سال انتشار: {book.publish_year}</p>
            <span className={book.is_available ? "badge available" : "badge unavailable"}>
              {book.is_available ? "موجود" : "ناموجود"}
            </span>
          </div>

          {book.is_available && (
            <button
              className="borrow-btn"
              disabled={borrowingId === book.id}
              onClick={() => onBorrow(book.id)}
            >
              {borrowingId === book.id ? "در حال ثبت..." : "من این کتاب را می‌خواهم"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
