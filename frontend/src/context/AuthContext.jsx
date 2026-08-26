import { createContext, useContext, useState, useCallback } from "react";
import { loginRequest, getProfile } from "../api/library";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("access_token"));
  const [user, setUser] = useState(null);

  const isAuthenticated = Boolean(token);

  const login = useCallback(async (nationalCode, password) => {
    const data = await loginRequest(nationalCode, password);
    localStorage.setItem("access_token", data.access_token);
    setToken(data.access_token);
    const profile = await getProfile();
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem("access_token")) return null;
    const profile = await getProfile();
    setUser(profile);
    return profile;
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth باید داخل AuthProvider استفاده شود");
  return ctx;
}
