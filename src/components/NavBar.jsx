import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export default function NavBar() {
  const nav = useNavigate();
  const { isAuthed, isAdmin, email, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <header className="navbar">
      <div className="brand">
        <Link to="/">AdRec</Link>
      </div>
      <nav className="flex">
        {isAuthed && (
          <>
            <Link to="/">Gợi ý</Link>
            <Link to="/health">Health</Link>
            {isAdmin && <Link to="/admin/ads">Quản trị</Link>}
          </>
        )}
      </nav>
      <div className="flex right">
        <button
          className="btn secondary"
          onClick={toggleTheme}
          title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
          style={{ padding: "8px 12px" }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {isAuthed ? (
          <>
            <span className="badge">
              {email || "User"}
              {role && (
                <span style={{ marginLeft: 8, opacity: 0.7 }}>• {role}</span>
              )}
            </span>
            <button className="btn secondary" onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link className="btn secondary" to="/login">
              Đăng nhập
            </Link>
            <Link className="btn" to="/register">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
