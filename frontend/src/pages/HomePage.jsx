import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import BookList from "../components/BookList";
import { searchBooks, borrowBook } from "../api/library";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [borrowingId, setBorrowingId] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const runSearch = useCallback(async (q) => {
    setQuery(q);
    setError(null);
    try {
      const results = await searchBooks(q);
      setBooks(results);
    } catch {
      setError("خطا در دریافت اطلاعات کتاب‌ها. لطفا دوباره تلاش کنید.");
    }
  }, []);

  useEffect(() => {
    runSearch("");
  }, [runSearch]);

  useEffect(() => {
    const pendingBookId = sessionStorage.getItem("pending_borrow_book_id");
    if (pendingBookId && isAuthenticated) {
      sessionStorage.removeItem("pending_borrow_book_id");
      handleBorrow(Number(pendingBookId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleBorrow = async (bookId) => {
    setMessage(null);
    setError(null);

    if (!isAuthenticated) {
      sessionStorage.setItem("pending_borrow_book_id", String(bookId));
      navigate("/login?next=/");
      return;
    }

    setBorrowingId(bookId);
    try {
      await borrowBook(bookId);
      setMessage("عملیات با موفقیت انجام شد.");
      runSearch(query); 
    } catch (err) {
      setError(err?.response?.data?.detail || "عملیات با خطا مواجه شد.");
    } finally {
      setBorrowingId(null);
    }
  };

  return (
    <div className="page home-page">
      <div className="search-section">
        <h1>جستجوی کتاب</h1>
        <SearchBar onSearch={runSearch} initialValue={query} />
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <BookList books={books} onBorrow={handleBorrow} borrowingId={borrowingId} />
    </div>
  );
}
