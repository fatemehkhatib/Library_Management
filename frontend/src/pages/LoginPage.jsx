import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [nationalCode, setNationalCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(nationalCode.trim(), password.trim());
      navigate(nextPath);
    } catch (err) {
      setError(err?.response?.data?.detail || "ورود ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <h1>ورود به حساب کاربری</h1>
      <p className="hint">نام کاربری و رمز عبور، هر دو کد ملی شما هستند.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          کد ملی (نام کاربری)
          <input
            type="text"
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value)}
            required
          />
        </label>

        <label>
          رمز عبور (کد ملی)
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
}
