import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);
const TOKEN_KEY = "rately_token";

function decodeUser(token) {
  try {
    const decoded = jwtDecode(token);
    // backend signs { userData } where userData is the full mongoose user doc
    const raw = decoded?.userData || {};
    return {
      id: raw._id,
      name: raw.userName,
      email: raw.userEmail,
      role: raw.userRole,
      profilePic: raw.profilePic,
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const existing = localStorage.getItem(TOKEN_KEY);
    return existing ? decodeUser(existing) : null;
  });

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    const decoded = decodeUser(token);
    // The backend issues very short-lived tokens (~2 min) — treat an expired
    // one as logged-out rather than silently sending it on every request.
    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      return;
    }
    setUser(decoded);
  }, [token]);

  useEffect(() => {
    const onExpired = () => setToken(null);
    window.addEventListener("rately:auth-expired", onExpired);
    return () => window.removeEventListener("rately:auth-expired", onExpired);
  }, []);

  const login = (newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    // set user in the same render as the token, otherwise a redirect right after
    // login hits ProtectedRoute while user is still null and bounces back to /login
    setUser(decodeUser(newToken));
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
