import { useState } from "react";
import { apiRecommend, apiRecommendByProfile } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Recommend() {
  const [activeTab, setActiveTab] = useState("text"); // "text" or "profile"
  const [text, setText] = useState(
    "Tôi quan tâm máy ảnh mirrorless và du lịch chụp ảnh."
  );
  const [limit, setLimit] = useState(5);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthed } = useAuth();
  const nav = useNavigate();

  // Text-based recommendation
  async function onSubmitText(e) {
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

  // Profile-based recommendation
  async function onSubmitProfile(e) {
    e.preventDefault();
    setErr(null);
    setRes(null);

    const limitNum = Number(limit);
    if (limitNum < 1 || limitNum > 50) {
      setErr("Số lượng quảng cáo phải từ 1 đến 50");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRecommendByProfile(limitNum);
      setRes(data);
    } catch (e) {
      const errorMsg = e.message;
      setErr(errorMsg);

      // If profile not found, show helpful message
      if (
        errorMsg.includes("Profile not found") ||
        errorMsg.includes("profile first")
      ) {
        setErr(
          "Bạn chưa có profile. Vui lòng tạo profile trước khi sử dụng tính năng này."
        );
      }

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
        <h2 style={{ textAlign: "center", marginBottom: 8 }}>
          Tìm kiếm quảng cáo phù hợp
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 14,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Chọn phương thức gợi ý quảng cáo phù hợp với bạn
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

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            borderBottom: "2px solid var(--border)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab("text");
              setRes(null);
              setErr(null);
            }}
            style={{
              flex: 1,
              padding: "12px 20px",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "text" ? "2px solid var(--accent)" : "none",
              color: activeTab === "text" ? "var(--accent)" : "var(--muted)",
              fontWeight: activeTab === "text" ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginBottom: -2,
            }}
          >
            Theo nội dung
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              setRes(null);
              setErr(null);
            }}
            style={{
              flex: 1,
              padding: "12px 20px",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "profile" ? "2px solid var(--accent)" : "none",
              color: activeTab === "profile" ? "var(--accent)" : "var(--muted)",
              fontWeight: activeTab === "profile" ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginBottom: -2,
            }}
          >
            Theo profile
          </button>
        </div>

        {/* Text-based Form */}
        {activeTab === "text" && (
          <form onSubmit={onSubmitText}>
            <div
              style={{
                padding: 16,
                background: "var(--panel)",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "var(--muted)",
                }}
              >
                <strong>Gợi ý theo nội dung:</strong> Phân tích văn bản bạn nhập
                để tìm quảng cáo phù hợp. Phù hợp cho việc tìm kiếm quảng cáo
                theo từ khóa cụ thể.
              </p>
            </div>

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
        )}

        {/* Profile-based Form */}
        {activeTab === "profile" && (
          <form onSubmit={onSubmitProfile}>
            <div
              style={{
                padding: 16,
                background: "var(--panel)",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "var(--muted)",
                }}
              >
                <strong>Gợi ý theo profile:</strong> Sử dụng thông tin cá nhân
                đã lưu của bạn để tìm quảng cáo phù hợp. AI sẽ phân tích độ
                tuổi, giới tính, sở thích và thói quen của bạn.
              </p>
            </div>

            <div
              style={{
                padding: 16,
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <div className="flex" style={{ alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}></span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14 }}>
                    Tính năng này sử dụng profile đã lưu của bạn. Nếu chưa có
                    profile, vui lòng{" "}
                    <Link
                      to="/profile"
                      style={{ fontWeight: 600, color: "var(--accent)" }}
                    >
                      tạo profile tại đây
                    </Link>
                    .
                  </p>
                </div>
              </div>
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
                {loading ? "Đang phân tích..." : "Gợi ý cho tôi"}
              </button>
              <Link to="/profile" className="btn secondary">
                Quản lý Profile
              </Link>
            </div>
          </form>
        )}
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
          {err.includes("profile") && err.includes("tạo") && (
            <Link
              to="/profile"
              className="btn"
              style={{ marginTop: 12, display: "inline-block" }}
            >
              Tạo Profile ngay
            </Link>
          )}
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
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    background: "var(--panel)",
                    borderRadius: 4,
                    fontSize: 12,
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  {activeTab === "text"
                    ? "Phân tích theo nội dung"
                    : "Phân tích theo profile"}
                </div>
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
                <small style={{ fontWeight: 600 }}>
                  {activeTab === "text"
                    ? "Lý do phân loại:"
                    : "Phân tích AI về profile của bạn:"}
                </small>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {res.reasons.map((r, i) => (
                    <div
                      key={i}
                      className="tag"
                      style={{
                        background: "var(--panel)",
                        padding: "10px 12px",
                        textAlign: "left",
                      }}
                    >
                      <strong>{i + 1}.</strong> {r}
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
