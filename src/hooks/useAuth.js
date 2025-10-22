import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

// Helper to decode JWT token
function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

// Helper to check if token is expired
function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 < Date.now();
}

// Helper to get user role from token
function getUserRole(token) {
  const payload = decodeToken(token);
  return payload?.role || "user";
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token")
  );
  const [email, setEmail] = useState(() => localStorage.getItem("email"));
  const [tokenType, setTokenType] = useState(
    () => localStorage.getItem("token_type") || "bearer"
  );

  useEffect(() => {
    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        logout();
        return;
      }

      localStorage.setItem("access_token", token);
      localStorage.setItem("token_type", tokenType || "bearer");
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
    }

    if (email) {
      localStorage.setItem("email", email);
    } else {
      localStorage.removeItem("email");
    }
  }, [token, tokenType, email]);

  const login = (access_token, maybeEmail, maybeType) => {
    if (!access_token) {
      throw new Error("Thiếu access token trong phản hồi đăng nhập.");
    }

    const resolvedType = maybeType || "bearer";
    setToken(access_token);
    setTokenType(resolvedType);

    if (maybeEmail) {
      setEmail(maybeEmail);
    }
  };

  const logout = () => {
    setToken(null);
    setTokenType("bearer");
    setEmail(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("email");
  };

  const role = token ? getUserRole(token) : null;
  const isAdmin = role === "admin";

  const value = useMemo(
    () => ({
      token,
      tokenType,
      email,
      role,
      isAuthed: !!token,
      isAdmin,
      login,
      logout,
    }),
    [token, tokenType, email, role, isAdmin]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider.");
  }
  return ctx;
}
