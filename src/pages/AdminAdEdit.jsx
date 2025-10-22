import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiGetAd, apiUpdateAd } from "../api/client";

export default function AdminAdEdit() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiGetAd(id)
      .then(setAd)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function save(e) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    // Validation
    if (!ad.title || ad.title.trim().length === 0) {
      setErr("Tiêu đề không được để trống");
      return;
    }

    setLoading(true);

    const payload = {
      title: ad.title?.trim() || null,
      description: ad.description?.trim() || null,
      target_audience: ad.target_audience?.trim() || null,
      labels: ad.labels && ad.labels.length > 0 ? ad.labels : null,
    };

    try {
      await apiUpdateAd(id, payload);
      setMsg("Đã lưu thành công! Đang chuyển về danh sách...");
      setTimeout(() => nav("/admin/ads"), 1200);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !ad) {
    return (
      <div
        className="card"
        style={{ marginTop: 40, textAlign: "center", padding: 60 }}
      >
        <p style={{ color: "var(--muted)" }}>Đang tải thông tin quảng cáo...</p>
      </div>
    );
  }

  if (err && !ad) {
    return (
      <div
        className="card"
        style={{ marginTop: 40, textAlign: "center", padding: 60 }}
      >
        <h3 style={{ color: "var(--danger-text)" }}>Lỗi</h3>
        <p style={{ color: "var(--muted)" }}>{err}</p>
        <Link className="btn" to="/admin/ads" style={{ marginTop: 20 }}>
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (!ad) return null;

  return (
    <div className="card" style={{ maxWidth: 800, margin: "40px auto" }}>
      <div
        className="flex"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ textAlign: "center", flex: 1 }}>
          <h2 style={{ margin: 0 }}>Chỉnh sửa quảng cáo</h2>
          <p
            style={{ color: "var(--muted)", fontSize: 14, margin: "4px 0 0 0" }}
          >
            ID: <code className="mono">#{ad.id}</code> • External:{" "}
            <code className="mono">{ad.external_id}</code>
          </p>
        </div>
        <Link className="btn secondary" to="/admin/ads">
          ← Quay lại
        </Link>
      </div>

      {err && (
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
            color: "var(--danger-text)",
            marginBottom: 16,
          }}
        >
          <strong>Lỗi:</strong> {err}
        </div>
      )}

      {msg && (
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: "var(--ok-bg)",
            border: "1px solid var(--ok-border)",
            color: "var(--ok-text)",
            marginBottom: 16,
          }}
        >
          {msg}
        </div>
      )}

      <form onSubmit={save}>
        <div className="field">
          <label>External ID (không thể chỉnh sửa)</label>
          <input value={ad.external_id} disabled style={{ opacity: 0.6 }} />
        </div>

        <div className="field">
          <label>
            Tiêu đề <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            value={ad.title || ""}
            onChange={(e) => setAd({ ...ad, title: e.target.value })}
            placeholder="Nhập tiêu đề quảng cáo"
            required
            disabled={loading}
          />
        </div>

        <div className="field">
          <label>Mô tả</label>
          <textarea
            rows={5}
            value={ad.description || ""}
            onChange={(e) => setAd({ ...ad, description: e.target.value })}
            placeholder="Nhập mô tả chi tiết về quảng cáo..."
            disabled={loading}
          />
          <small style={{ display: "block", marginTop: 4 }}>
            {(ad.description || "").length} ký tự
          </small>
        </div>

        <div className="field">
          <label>Đối tượng mục tiêu</label>
          <input
            value={ad.target_audience || ""}
            onChange={(e) => setAd({ ...ad, target_audience: e.target.value })}
            placeholder="Ví dụ: Nam/Nữ 18-35 tuổi, yêu thích công nghệ"
            disabled={loading}
          />
        </div>

        <div className="field">
          <label>Nhãn (Labels)</label>
          <input
            value={(ad.labels || []).join?.(", ") || ""}
            onChange={(e) =>
              setAd({
                ...ad,
                labels: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="TECHNOLOGY, FASHION, FOOD (ngăn cách bởi dấu phẩy)"
            disabled={loading}
          />
          <small style={{ display: "block", marginTop: 4 }}>
            {ad.labels && ad.labels.length > 0 ? (
              <span>
                {ad.labels.length} nhãn:{" "}
                {ad.labels.map((label, i) => (
                  <span
                    key={i}
                    className="tag"
                    style={{
                      marginRight: 4,
                      marginTop: 4,
                      display: "inline-block",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </span>
            ) : (
              <span style={{ color: "var(--muted)" }}>Chưa có nhãn nào</span>
            )}
          </small>
        </div>

        <div className="flex" style={{ gap: 12, marginTop: 24 }}>
          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <Link className="btn secondary" to="/admin/ads" style={{ flex: 0 }}>
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
