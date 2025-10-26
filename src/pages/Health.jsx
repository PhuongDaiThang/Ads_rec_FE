import { useEffect, useState } from "react";
import { apiHealth } from "../api/client";

export default function Health() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = () => {
    setLoading(true);
    setErr(null);
    apiHealth()
      .then(setData)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="card" style={{ marginTop: 40 }}>
      <div
        className="flex"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ textAlign: "center", flex: 1 }}>
          <h2 style={{ margin: 0 }}>Health Check</h2>
          <p
            style={{ color: "var(--muted)", fontSize: 14, margin: "4px 0 0 0" }}
          >
            Kiểm tra trạng thái kết nối với backend API
          </p>
        </div>
        <button
          className="btn secondary"
          onClick={checkHealth}
          disabled={loading}
        >
          {loading ? "Đang kiểm tra..." : "Làm mới"}
        </button>
      </div>
      {err && (
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "var(--danger-text)", margin: 0 }}>
            Không thể kết nối
          </h3>
          <p style={{ color: "var(--danger-text)", margin: "8px 0 0 0" }}>
            {err}
          </p>
        </div>
      )}

      {loading && !data && !err && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ color: "var(--muted)" }}>Đang kiểm tra kết nối...</p>
        </div>
      )}

      {data && (
        <>
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              background: "var(--ok-bg)",
              border: "1px solid var(--ok-border)",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            <h3 style={{ color: "var(--ok-text)", margin: 0 }}>
              Hệ thống hoạt động bình thường
            </h3>
            <p
              style={{
                color: "var(--ok-text-secondary)",
                margin: "8px 0 0 0",
                fontSize: 14,
              }}
            >
              Backend API đang trực tuyến và sẵn sàng
            </p>
          </div>

          <div className="grid cols-3" style={{ gap: 16 }}>
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                background: "var(--info-bg)",
                border: "1px solid var(--info-border)",
                textAlign: "center",
              }}
            >
              <small
                style={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: 11,
                }}
              >
                Status
              </small>
              <div
                className="tag"
                style={{
                  marginTop: 8,
                  fontSize: 16,
                  background:
                    data.status === "ok" ? "var(--ok)" : "var(--danger)",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {data.status?.toUpperCase()}
              </div>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 8,
                background: "var(--info-bg)",
                border: "1px solid var(--info-border)",
                textAlign: "center",
              }}
            >
              <small
                style={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: 11,
                }}
              >
                Labels Count
              </small>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  marginTop: 8,
                  color: "var(--accent)",
                }}
              >
                {data.labels_count}
              </div>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 8,
                background: "var(--info-bg)",
                border: "1px solid var(--info-border)",
                textAlign: "center",
              }}
            >
              <small
                style={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: 11,
                }}
              >
                Response Time
              </small>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  marginTop: 8,
                  color: "var(--ok)",
                }}
              >
                {"< 1s"}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 8,
              background: "var(--info-bg)",
              border: "1px solid var(--info-border)",
            }}
          >
            <small
              style={{
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: 11,
              }}
            >
              API Base URL
            </small>
            <div
              className="mono"
              style={{
                marginTop: 8,
                padding: "8px 12px",
                background: "var(--code-bg)",
                borderRadius: 6,
                fontSize: 13,
                wordBreak: "break-all",
              }}
            >
              {import.meta.env.VITE_API_BASE || "http://localhost:8000"}
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              padding: 12,
              borderRadius: 8,
              background: "var(--panel)",
              border: "1px solid var(--border)",
              fontSize: 13,
            }}
          >
            <strong>Thông tin:</strong>
            <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
              <li>Endpoint này là PUBLIC (không yêu cầu authentication)</li>
              <li>
                Số lượng nhãn hiện có trong hệ thống:{" "}
                <strong>{data.labels_count}</strong>
              </li>
              <li>Backend đã sẵn sàng xử lý requests</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
