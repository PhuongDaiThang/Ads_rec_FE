import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiCreateAd } from "../api/client";

export default function CreateAd() {
  const [ad, setAd] = useState({
    title: "",
    description: "",
    target_audience: "",
    topic: "",
  });
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

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

    // Build payload - only include fields with values
    const payload = {
      title: ad.title.trim(), // Required field
    };

    // Optional fields - only add if they have values
    if (ad.description?.trim()) {
      payload.description = ad.description.trim();
    }
    if (ad.target_audience?.trim()) {
      payload.target_audience = ad.target_audience.trim();
    }
    if (ad.topic?.trim()) {
      payload.topic = ad.topic.trim();
    }

    try {
      await apiCreateAd(payload);
      setMsg("Tạo quảng cáo thành công! Đang chuyển về danh sách...");
      setTimeout(() => nav("/admin/ads"), 1200);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

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
          <h2 style={{ margin: 0 }}>Tạo quảng cáo mới</h2>
          <p
            style={{ color: "var(--muted)", fontSize: 14, margin: "4px 0 0 0" }}
          >
            Thêm quảng cáo mới vào hệ thống
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
          <label>Chủ đề (Topic)</label>
          <input
            value={ad.topic || ""}
            onChange={(e) => setAd({ ...ad, topic: e.target.value })}
            placeholder="Ví dụ: Công nghệ, Thời trang, Du lịch..."
            disabled={loading}
          />
          <small
            style={{ display: "block", marginTop: 4, color: "var(--muted)" }}
          >
            Tùy chọn. Nhập tên topic/nhãn cho quảng cáo này.
          </small>
        </div>

        <div className="flex" style={{ gap: 12, marginTop: 24 }}>
          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading ? "Đang tạo..." : "Tạo quảng cáo"}
          </button>
          <Link className="btn secondary" to="/admin/ads" style={{ flex: 0 }}>
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
