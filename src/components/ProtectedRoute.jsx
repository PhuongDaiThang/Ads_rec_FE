import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthed, isAdmin } = useAuth();

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div
        className="card"
        style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}
      >
        <h2>🔒 Truy cập bị từ chối</h2>
        <p style={{ color: "var(--muted)" }}>
          Bạn không có quyền truy cập vào trang này. Chỉ admin mới có thể truy
          cập.
        </p>
        <p style={{ marginTop: 16 }}>
          <strong>Role hiện tại:</strong> <span className="tag">user</span>
        </p>
        <div style={{ marginTop: 24 }}>
          <a href="/" className="btn">
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return children;
}
