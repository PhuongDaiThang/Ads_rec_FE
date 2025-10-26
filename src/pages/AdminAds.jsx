import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiListAds, apiDeleteAd } from "../api/client";

export default function AdminAds() {
  const [ads, setAds] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  async function load() {
    setErr(null);
    try {
      const adsData = await apiListAds();
      setAds(adsData);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function del(ad) {
    if (!window.confirm(`Bạn có chắc muốn xóa quảng cáo "${ad.title}"?`)) {
      return;
    }

    setBusy(ad.id);
    try {
      await apiDeleteAd(ad.id);
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(null);
    }
  }

  const filteredAds = ads?.filter((ad) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      ad.title?.toLowerCase().includes(search) ||
      ad.description?.toLowerCase().includes(search) ||
      ad.target_audience?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div
        className="flex"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ textAlign: "center", flex: 1 }}>
          <h2 style={{ margin: 0 }}>Quản trị quảng cáo</h2>
          <p
            style={{ color: "var(--muted)", fontSize: 14, margin: "4px 0 0 0" }}
          >
            Quản lý danh sách quảng cáo trong hệ thống
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link className="btn" to="/admin/ads/create">
            Tạo quảng cáo
          </Link>
        </div>
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

      {!ads ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ color: "var(--muted)" }}>
            Đang tải danh sách quảng cáo...
          </p>
        </div>
      ) : ads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ color: "var(--muted)" }}>Chưa có quảng cáo nào</p>
          <Link
            className="btn"
            to="/admin/ads/create"
            style={{ marginTop: 16 }}
          >
            Tạo quảng cáo đầu tiên
          </Link>
        </div>
      ) : (
        <>
          <div className="field" style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, mã, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: 14 }}
            />
            {searchTerm && (
              <small style={{ display: "block", marginTop: 4 }}>
                Tìm thấy {filteredAds?.length || 0} / {ads.length} quảng cáo
              </small>
            )}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>STT</th>
                  <th>Tiêu đề</th>
                  <th>Mô tả</th>
                  <th>Đối tượng</th>
                  <th style={{ width: 100, textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds && filteredAds.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "var(--muted)",
                      }}
                    >
                      Không tìm thấy kết quả phù hợp
                    </td>
                  </tr>
                ) : (
                  filteredAds?.map((a, index) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600, color: "var(--accent)" }}>
                        {index + 1}
                      </td>
                      <td style={{ fontWeight: 600 }}>{a.title}</td>
                      <td>
                        {a.description ? (
                          <span style={{ fontSize: 13 }}>
                            {a.description.length > 60
                              ? a.description.substring(0, 60) + "..."
                              : a.description}
                          </span>
                        ) : (
                          <span style={{ color: "var(--muted)" }}>-</span>
                        )}
                      </td>
                      <td>
                        {a.target_audience || (
                          <span style={{ color: "var(--muted)" }}>-</span>
                        )}
                      </td>
                      <td>
                        <div
                          className="flex"
                          style={{ justifyContent: "flex-end", gap: 8 }}
                        >
                          <Link
                            to={`/admin/ads/${a.id}`}
                            className="btn secondary"
                            style={{ fontSize: 13, padding: "6px 12px" }}
                          >
                            Sửa
                          </Link>
                          <button
                            className="btn danger"
                            disabled={busy === a.id}
                            onClick={() => del(a)}
                            style={{ fontSize: 13, padding: "6px 12px" }}
                          >
                            {busy === a.id ? "Đang xóa..." : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {ads && ads.length > 0 && (
            <div
              style={{
                marginTop: 16,
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              Tổng cộng: <strong>{ads.length}</strong> quảng cáo
            </div>
          )}
        </>
      )}
    </div>
  );
}
