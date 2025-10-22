import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRegister } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { isAuthed } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthed) {
      nav("/", { replace: true });
    }
  }, [isAuthed, nav]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
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

    if (password !== confirmPassword) {
      setErr("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const res = await apiRegister({ email, password });
      setMsg("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
      setTimeout(() => nav("/login"), 1500);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 460, margin: "40px auto" }}>
      <h2 style={{ textAlign: "center" }}>Đăng ký tài khoản</h2>
      <p
        style={{
          color: "var(--muted)",
          fontSize: 14,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Tạo tài khoản mới để sử dụng hệ thống
      </p>

      {msg && <div className="alert success">{msg}</div>}

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
          <small style={{ display: "block", marginTop: 4 }}>
            Tối thiểu 6 ký tự
          </small>
        </div>

        <div className="field">
          <label>Xác nhận mật khẩu</label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
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
          {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link
            className="btn secondary"
            to="/login"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}
