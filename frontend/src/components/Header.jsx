import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <Link to="/" className="brand">
        کتابخانه من
      </Link>

      <div className="header-actions">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="header-link">
              پروفایل
            </Link>
            <button className="header-link logout-btn" onClick={handleLogout}>
              خروج
            </button>
          </>
        ) : (
          <Link to="/login" className="header-link">
            پروفایل / ورود
          </Link>
        )}
      </div>
    </header>
  );
}
