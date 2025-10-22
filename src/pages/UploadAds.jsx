import { useState } from "react";
import { Link } from "react-router-dom";
import { apiUploadAds } from "../api/client";

export default function UploadAds() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file) => {
    if (!file) {
      setErr("Vui lòng chọn file");
      return false;
    }

    // Check file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const extension = file.name.split(".").pop().toLowerCase();
    const validExtensions = ["csv", "xls", "xlsx"];

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(extension)
    ) {
      setErr("Chỉ chấp nhận file CSV hoặc Excel (.csv, .xls, .xlsx)");
      return false;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErr("File không được vượt quá 10MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setErr(null);
      } else {
        setFile(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setErr(null);
      } else {
        setFile(null);
      }
    }
  };

  async function submit(e) {
    e.preventDefault();

    if (!file) {
      setErr("Vui lòng chọn file trước khi upload");
      return;
    }

    setErr(null);
    setRes(null);
    setBusy(true);

    try {
      const result = await apiUploadAds(file);
      setRes(result);
      setFile(null);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 700, margin: "40px auto" }}>
      <div
        className="flex"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ textAlign: "center", flex: 1 }}>
          <h2 style={{ margin: 0 }}>Upload Quảng Cáo</h2>
          <p
            style={{ color: "var(--muted)", fontSize: 14, margin: "4px 0 0 0" }}
          >
            Tải lên file CSV hoặc Excel chứa danh sách quảng cáo
          </p>
        </div>
        <Link className="btn secondary" to="/admin/ads">
          ← Quay lại
        </Link>
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 8,
          background: "var(--info-bg)",
          border: "1px solid var(--info-border)",
          marginBottom: 20,
        }}
      >
        <p style={{ margin: 0, fontSize: 13 }}>
          <strong>Format file yêu cầu:</strong>
          <br />
          Các cột:{" "}
          <code
            className="mono"
            style={{
              background: "var(--code-bg)",
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            external_id, title, description, target_audience, labels
          </code>
        </p>
      </div>

      <form onSubmit={submit}>
        <div
          className="field"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label>File CSV/Excel</label>
          <div
            style={{
              border: dragActive
                ? "2px dashed var(--accent)"
                : "2px dashed var(--border-dashed)",
              borderRadius: 12,
              padding: 40,
              textAlign: "center",
              background: dragActive ? "var(--panel-hover)" : "var(--input-bg)",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
            <p style={{ marginBottom: 12 }}>
              {file ? (
                <>
                  <strong>{file.name}</strong>
                  <br />
                  <small style={{ color: "var(--muted)" }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </small>
                </>
              ) : (
                <>
                  Kéo thả file vào đây hoặc{" "}
                  <strong style={{ color: "var(--accent)" }}>chọn file</strong>
                </>
              )}
            </p>
            <input
              type="file"
              accept=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              onChange={handleFileChange}
              disabled={busy}
              style={{ display: "block", margin: "0 auto", maxWidth: 300 }}
            />
          </div>
        </div>

        <button
          className="btn"
          type="submit"
          disabled={busy || !file}
          style={{ width: "100%", marginTop: 16 }}
        >
          {busy ? "Đang upload..." : "Upload File"}
        </button>
      </form>

      {err && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            borderRadius: 8,
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
            color: "var(--danger-text)",
          }}
        >
          <strong>Lỗi:</strong> {err}
        </div>
      )}

      {res && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 8,
            background: "var(--ok-bg)",
            border: "1px solid var(--ok-border)",
          }}
        >
          <h3 style={{ color: "var(--ok-text)", marginTop: 0 }}>
            Upload thành công!
          </h3>
          <div className="grid cols-3" style={{ gap: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--ok-text)",
                }}
              >
                {res.labels_created}
              </div>
              <small style={{ color: "var(--ok-text-secondary)" }}>
                Nhãn mới
              </small>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--ok-text)",
                }}
              >
                {res.ads_created}
              </div>
              <small style={{ color: "var(--ok-text-secondary)" }}>
                QC mới
              </small>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--ok-text)",
                }}
              >
                {res.ads_updated}
              </div>
              <small style={{ color: "var(--ok-text-secondary)" }}>
                QC cập nhật
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
