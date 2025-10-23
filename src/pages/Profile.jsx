import { useState, useEffect } from "react";
import {
  apiGetProfile,
  apiCreateOrUpdateProfile,
  apiDeleteProfile,
} from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { isAuthed } = useAuth();
  const nav = useNavigate();

  const [profile, setProfile] = useState({
    age: "",
    gender: "",
    location: "",
    interests: [],
    occupation: "",
    income_level: "",
    education: "",
    marital_status: "",
  });

  const [existingProfile, setExistingProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [interestInput, setInterestInput] = useState("");

  // Predefined interests
  const predefinedInterests = [
    "công nghệ",
    "thời trang",
    "du lịch",
    "ẩm thực",
    "thể thao",
    "game",
    "đọc sách",
    "âm nhạc",
    "phim",
    "nhiếp ảnh",
    "làm đẹp",
    "nội thất",
    "gia đình",
    "nấu ăn",
    "sức khỏe",
  ];

  useEffect(() => {
    if (isAuthed) {
      loadProfile();
    }
  }, [isAuthed]);

  const loadProfile = async () => {
    try {
      setError(null);
      const data = await apiGetProfile();
      setExistingProfile(data);
      setProfile({
        age: data.age || "",
        gender: data.gender || "",
        location: data.location || "",
        interests: data.interests || [],
        occupation: data.occupation || "",
        income_level: data.income_level || "",
        education: data.education || "",
        marital_status: data.marital_status || "",
      });
    } catch (e) {
      // 404 means profile doesn't exist yet, which is fine
      if (e.message.includes("404") || e.message.includes("not found")) {
        setExistingProfile(null);
      } else {
        setError(e.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Clean up data - remove empty strings
      const cleanedData = {};
      Object.keys(profile).forEach((key) => {
        if (key === "interests") {
          cleanedData[key] = profile[key];
        } else if (profile[key] !== "") {
          cleanedData[key] = profile[key];
        }
      });

      // Convert age to number if present
      if (cleanedData.age) {
        cleanedData.age = Number(cleanedData.age);
      }

      const data = await apiCreateOrUpdateProfile(cleanedData);
      setExistingProfile(data);
      setSuccess(
        existingProfile
          ? "Cập nhật profile thành công!"
          : "Tạo profile thành công!"
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa profile không?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiDeleteProfile();
      setExistingProfile(null);
      setProfile({
        age: "",
        gender: "",
        location: "",
        interests: [],
        occupation: "",
        income_level: "",
        education: "",
        marital_status: "",
      });
      setSuccess("Đã xóa profile thành công!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const addCustomInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed && !profile.interests.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, trimmed],
      }));
      setInterestInput("");
    }
  };

  const removeInterest = (interest) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  // Calculate profile completion percentage
  const getCompletionPercentage = () => {
    const fields = [
      profile.age,
      profile.gender,
      profile.location,
      profile.interests.length > 0,
      profile.occupation,
      profile.income_level,
      profile.education,
      profile.marital_status,
    ];
    const filledFields = fields.filter((f) => f).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="grid" style={{ gap: 20, marginTop: 20 }}>
      <div className="card">
        <div
          className="flex"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Thông tin cá nhân</h2>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 14,
                margin: "4px 0 0 0",
              }}
            >
              {existingProfile
                ? "Cập nhật thông tin của bạn để nhận gợi ý quảng cáo phù hợp"
                : "Tạo profile để nhận gợi ý quảng cáo dựa trên sở thích"}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {completionPercentage}%
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Hoàn thành
            </div>
          </div>
        </div>

        {completionPercentage < 100 && (
          <div
            style={{
              marginTop: 16,
              height: 8,
              background: "var(--panel)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${completionPercentage}%`,
                background: "var(--accent)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}
      </div>

      {error && (
        <div
          className="card"
          style={{
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
          }}
        >
          <p style={{ color: "var(--danger-text)", margin: 0 }}>{error}</p>
        </div>
      )}

      {success && (
        <div
          className="card"
          style={{
            background: "var(--success-bg)",
            border: "1px solid var(--success-border)",
          }}
        >
          <p style={{ color: "var(--success-text)", margin: 0 }}>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Thông tin cơ bản</h3>

          <div className="grid" style={{ gap: 16 }}>
            <div className="field">
              <label>Tuổi</label>
              <input
                type="number"
                min="1"
                max="120"
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: e.target.value })
                }
                placeholder="Ví dụ: 25"
                disabled={loading}
              />
            </div>

            <div className="field">
              <label>Giới tính</label>
              <select
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
                disabled={loading}
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="field">
              <label>Tình trạng hôn nhân</label>
              <select
                value={profile.marital_status}
                onChange={(e) =>
                  setProfile({ ...profile, marital_status: e.target.value })
                }
                disabled={loading}
              >
                <option value="">-- Chọn --</option>
                <option value="Độc thân">Độc thân</option>
                <option value="Đã kết hôn">Đã kết hôn</option>
                <option value="Ly hôn">Ly hôn</option>
                <option value="Góa">Góa</option>
              </select>
            </div>

            <div className="field">
              <label>Địa điểm</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
                placeholder="Ví dụ: Hà Nội"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Công việc & Học vấn</h3>

          <div className="grid" style={{ gap: 16 }}>
            <div className="field">
              <label>Nghề nghiệp</label>
              <input
                type="text"
                value={profile.occupation}
                onChange={(e) =>
                  setProfile({ ...profile, occupation: e.target.value })
                }
                placeholder="Ví dụ: Software Engineer"
                disabled={loading}
              />
            </div>

            <div className="field">
              <label>Mức thu nhập</label>
              <select
                value={profile.income_level}
                onChange={(e) =>
                  setProfile({ ...profile, income_level: e.target.value })
                }
                disabled={loading}
              >
                <option value="">-- Chọn mức thu nhập --</option>
                <option value="Thấp">Thấp (&lt; 10 triệu)</option>
                <option value="Trung bình">Trung bình (10-30 triệu)</option>
                <option value="Cao">Cao (&gt; 30 triệu)</option>
              </select>
            </div>

            <div className="field">
              <label>Trình độ học vấn</label>
              <select
                value={profile.education}
                onChange={(e) =>
                  setProfile({ ...profile, education: e.target.value })
                }
                disabled={loading}
              >
                <option value="">-- Chọn trình độ --</option>
                <option value="Trung học">Trung học</option>
                <option value="Cao đẳng">Cao đẳng</option>
                <option value="Đại học">Đại học</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Sở thích</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>
              Chọn từ danh sách có sẵn
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {predefinedInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className="tag"
                  onClick={() => toggleInterest(interest)}
                  disabled={loading}
                  style={{
                    cursor: "pointer",
                    background: profile.interests.includes(interest)
                      ? "var(--accent)"
                      : "var(--panel)",
                    color: profile.interests.includes(interest)
                      ? "white"
                      : "inherit",
                    border: profile.interests.includes(interest)
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                    fontWeight: profile.interests.includes(interest)
                      ? 600
                      : 400,
                  }}
                >
                  {profile.interests.includes(interest) && "✓ "}
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Hoặc thêm sở thích khác</label>
            <div className="flex" style={{ gap: 8 }}>
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomInterest();
                  }
                }}
                placeholder="Nhập sở thích và nhấn Enter"
                disabled={loading}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn secondary"
                onClick={addCustomInterest}
                disabled={loading || !interestInput.trim()}
              >
                Thêm
              </button>
            </div>
          </div>

          {profile.interests.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <small style={{ fontWeight: 600 }}>
                Đã chọn ({profile.interests.length}):
              </small>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {profile.interests.map((interest) => (
                  <div
                    key={interest}
                    className="tag"
                    style={{
                      background: "var(--accent)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      disabled={loading}
                      style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        padding: 0,
                        fontSize: 16,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex" style={{ gap: 12 }}>
            <button
              className="btn"
              type="submit"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading
                ? "Đang lưu..."
                : existingProfile
                ? "Cập nhật Profile"
                : "Tạo Profile"}
            </button>
            {existingProfile && (
              <button
                className="btn secondary"
                type="button"
                onClick={handleDelete}
                disabled={loading}
                style={{
                  background: "var(--danger-bg)",
                  color: "var(--danger-text)",
                  border: "1px solid var(--danger-border)",
                }}
              >
                Xóa Profile
              </button>
            )}
          </div>
        </div>
      </form>

      {existingProfile && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>✨ Profile của bạn đã sẵn sàng!</h3>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>
            Bạn có thể sử dụng tính năng "Gợi ý theo Profile" để nhận quảng cáo
            phù hợp với thông tin cá nhân của bạn.
          </p>
          <button
            className="btn"
            onClick={() => nav("/")}
            style={{ width: "100%" }}
          >
            Xem gợi ý quảng cáo →
          </button>
        </div>
      )}
    </div>
  );
}
