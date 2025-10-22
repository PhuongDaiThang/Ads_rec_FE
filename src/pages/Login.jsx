import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiLogin } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { login, isAuthed } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthed) {
      nav("/", { replace: true });
    }
  }, [isAuthed, nav]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);

    // Validation
    if (!email || !email.includes("@")) {
      setErr("Vui lòng nhập email hợp lệ");
      return;
    }

    if (!password || password.length < 6) {
      setErr("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      const res = await apiLogin({ email, password });
      const accessToken = res?.access_token;
      const tokenType = res?.token_type || "bearer";
      const resolvedEmail = res?.email || email;

      login(accessToken, resolvedEmail, tokenType);
      nav("/");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 460, margin: "40px auto" }}>
      <h2 style={{ textAlign: "center" }}>Đăng nhập</h2>
      <p
        style={{
          color: "var(--muted)",
          fontSize: 14,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Đăng nhập để sử dụng hệ thống gợi ý quảng cáo
      </p>

      {err && <div className="alert error">{err}</div>}

      <form onSubmit={onSubmit}>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="field">
          <label>Mật khẩu</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 18,
                padding: 4,
              }}
              disabled={loading}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <button
          className="btn"
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link
            className="btn secondary"
            to="/register"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Chưa có tài khoản? Đăng ký ngay
          </Link>
        </div>
      </form>
    </div>
  );
}
