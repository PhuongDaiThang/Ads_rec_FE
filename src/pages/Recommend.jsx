import { useState } from "react";
import { apiRecommend } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Recommend() {
  const [text, setText] = useState(
    "Tôi quan tâm máy ảnh mirrorless và du lịch chụp ảnh."
  );
  const [limit, setLimit] = useState(5);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthed } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setRes(null);

    // Validation
    if (!text || text.trim().length < 10) {
      setErr("Vui lòng nhập ít nhất 10 ký tự mô tả sở thích của bạn");
      return;
    }

    const limitNum = Number(limit);
    if (limitNum < 1 || limitNum > 50) {
      setErr("Số lượng quảng cáo phải từ 1 đến 50");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRecommend({ text: text.trim(), limit: limitNum });
      setRes(data);
    } catch (e) {
      setErr(e.message);
      if (!isAuthed) {
        setTimeout(() => nav("/login"), 1000);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleClear = () => {
    setText("");
    setRes(null);
    setErr(null);
  };

  return (
    <div className="grid" style={{ gap: 20, marginTop: 20 }}>
      <div className="card">
        <h2 style={{ textAlign: "center" }}>Tìm kiếm quảng cáo phù hợp</h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 14,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Nhập mô tả về sở thích, nhu cầu của bạn để nhận gợi ý quảng cáo phù
          hợp
        </p>

        {!isAuthed && (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: "var(--panel)",
              border: "1px solid var(--border)",
              marginBottom: 16,
            }}
          >
            <small>
              Bạn cần{" "}
              <Link to="/login" style={{ fontWeight: 600 }}>
                đăng nhập
              </Link>{" "}
              để sử dụng tính năng này.
            </small>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Mô tả sở thích / nhu cầu của bạn</label>
            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ví dụ: Tôi muốn mua laptop gaming với cấu hình cao, màn hình 15 inch, giá tầm trung..."
              disabled={loading}
              style={{ fontSize: 14 }}
            />
            <small style={{ display: "block", marginTop: 4 }}>
              {text.length} ký tự {text.length < 10 && "(tối thiểu 10 ký tự)"}
            </small>
          </div>

          <div className="field">
            <label>
              Số lượng quảng cáo: <strong>{limit}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              disabled={loading}
              style={{ width: "100%" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              <span>1</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>

          <div className="flex" style={{ gap: 12, marginTop: 20 }}>
            <button
              className="btn"
              type="submit"
              disabled={loading || !isAuthed}
              style={{ flex: 1 }}
            >
              {loading ? "Đang phân tích..." : "Tìm kiếm"}
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={handleClear}
              disabled={loading}
            >
              Xóa
            </button>
          </div>
        </form>
      </div>

      {err && (
        <div
          className="card"
          style={{
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
          }}
        >
          <h3 style={{ color: "var(--danger-text)", marginBottom: 8 }}>Lỗi</h3>
          <p style={{ color: "var(--danger-text)", margin: 0 }}>{err}</p>
        </div>
      )}

      {res && (
        <>
          <div className="card">
            <div
              className="flex"
              style={{
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>Phân loại</h3>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: 14,
                    margin: "4px 0 0 0",
                  }}
                >
                  Kết quả phân tích AI
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  className="tag"
                  style={{
                    fontSize: 16,
                    padding: "8px 16px",
                    background: "var(--accent)",
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  {res.label}
                </div>
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  Độ tin cậy:{" "}
                  <strong>{(res.confidence * 100).toFixed(1)}%</strong>
                </div>
              </div>
            </div>

            {res.reasons && res.reasons.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <small style={{ fontWeight: 600 }}>Lý do phân loại:</small>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {res.reasons.map((r, i) => (
                    <div key={i} className="tag" style={{ flex: "1 1 auto" }}>
                      {i + 1}. {r}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {res.labels_available && res.labels_available.length > 0 && (
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid var(--border)",
                }}
              >
                <small style={{ fontWeight: 600 }}>
                  Các nhãn có sẵn trong hệ thống:
                </small>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {res.labels_available.map((l, i) => (
                    <span
                      key={i}
                      className="tag"
                      style={{
                        background:
                          l === res.label ? "var(--accent)" : undefined,
                        color: l === res.label ? "white" : undefined,
                      }}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16 }}>
              Quảng cáo đề xuất ({res.ads?.length || 0})
            </h3>

            {!res.ads || res.ads.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "var(--muted)",
                }}
              >
                <p>Không tìm thấy quảng cáo phù hợp</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 50 }}>STT</th>
                      <th>Tiêu đề</th>
                      <th>Mô tả</th>
                      <th>Đối tượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.ads.map((ad, index) => (
                      <tr key={ad.id}>
                        <td style={{ fontWeight: 600, color: "var(--accent)" }}>
                          {index + 1}
                        </td>
                        <td style={{ fontWeight: 600 }}>{ad.title}</td>
                        <td>
                          {ad.description || (
                            <span style={{ color: "var(--muted)" }}>-</span>
                          )}
                        </td>
                        <td>
                          {ad.target_audience || (
                            <span style={{ color: "var(--muted)" }}>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
