# 🎯 AdRec Frontend - Hệ thống Gợi ý Quảng Cáo

Giao diện frontend hiện đại cho **Advertising Recommendation System** được xây dựng với React + Vite.

## ✨ Tính năng chính

### 🔐 Authentication

- **Đăng ký tài khoản** với email và password
- **Đăng nhập** với JWT Bearer token
- **Bắt buộc đăng nhập** để truy cập app (chỉ cho phép ở trang login/register khi chưa đăng nhập)
- Auto-redirect nếu đã đăng nhập
- Show/hide password
- Form validation đầy đủ
- Auto-logout khi token hết hạn
- Protected routes với role-based access

### 🎨 Theme System

- **Dark mode & Light mode** toggle
- Theme preference được lưu trong localStorage
- Smooth transitions giữa các themes
- Nút toggle theme trên navbar (☀️/🌙)

### 🎯 Main Feature - Gợi ý quảng cáo

- Nhập mô tả sở thích/nhu cầu (textarea với character counter)
- Chọn số lượng quảng cáo (1-50) bằng slider
- Hiển thị kết quả phân tích AI:
  - Label được phân loại
  - Độ tin cậy (confidence %)
  - Lý do phân loại
  - Danh sách quảng cáo phù hợp
  - Các label có sẵn trong hệ thống
- Empty states và error handling

### 🏥 Health Check

- Kiểm tra kết nối với backend
- Hiển thị status, số lượng labels
- Refresh button
- Visual feedback (success/error states)

### 🛡️ Admin Panel (Chỉ dành cho admin role)

- **Danh sách quảng cáo**
  - Xem tất cả quảng cáo
  - Search/filter theo tiêu đề, mã, mô tả
  - Xóa quảng cáo (với confirmation dialog)
  - Pagination info
- **Chỉnh sửa quảng cáo**

  - Form đầy đủ với validation
  - Edit title, description, target audience, labels
  - Character counter
  - Visual label tags

- **Upload CSV/Excel**
  - Drag & drop file upload
  - File validation (type, size < 10MB)
  - Hỗ trợ .csv, .xls, .xlsx
  - Hiển thị kết quả upload (labels created, ads created/updated)

## 🚀 Cài đặt và chạy

### Prerequisites

- Node.js >= 16
- npm/yarn/pnpm

### Cấu hình

Tạo file `.env` ở thư mục gốc (tùy chọn):

```env
VITE_API_BASE=http://localhost:8000
```

**Lưu ý:**

- Nếu không đặt biến môi trường, mặc định sẽ là `http://localhost:8000`
- Theme mặc định là dark mode, có thể toggle sang light mode bằng nút trên navbar

### Development

```bash
# Cài đặt dependencies
npm install

# Chạy dev server (mặc định: http://localhost:5173)
npm run dev
```

### Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

## 📁 Cấu trúc dự án

```
src/
├── api/
│   └── client.js          # API client với tất cả endpoints
├── components/
│   ├── NavBar.jsx         # Navigation bar với role-based menu
│   └── ProtectedRoute.jsx # Route protection (user/admin)
├── hooks/
│   └── useAuth.js         # Auth context và JWT management
├── pages/
│   ├── Login.jsx          # Trang đăng nhập
│   ├── Register.jsx       # Trang đăng ký
│   ├── Recommend.jsx      # Trang gợi ý quảng cáo (main feature)
│   ├── Health.jsx         # Health check
│   ├── AdminAds.jsx       # Danh sách quảng cáo
│   ├── AdminAdEdit.jsx    # Sửa quảng cáo
│   └── UploadAds.jsx      # Upload CSV
├── styles/
│   └── app.css            # Global styles
├── App.jsx                # App component
└── main.jsx               # Entry point
```

## 🔑 Key Features Implementation

### Authentication Flow

- JWT token lưu trong `localStorage` với key `access_token`
- Token được decode để lấy user role (admin/user)
- Auto-check token expiration
- Protected routes với role-based access control

### API Integration

- Base URL configurable qua env variable
- Centralized error handling
- Proper response handling (204 No Content, JSON, etc.)
- Authorization header tự động được thêm vào

### UI/UX Enhancements

- Dark theme với gradient backgrounds
- Smooth transitions và hover effects
- Loading states cho tất cả actions
- Error states với clear messages
- Empty states với helpful icons
- Responsive design (mobile-friendly)
- Custom scrollbar styling

## 🎨 Design System

### Colors

- Background: Dark blue gradient
- Primary (Accent): `#4c8bf5`
- Success: `#2ecc71`
- Danger: `#f25f5c`
- Warning: `#f1c40f`
- Text: `#e6ecff`
- Muted: `#7a8dab`

### Components

- **Cards**: Glassmorphism effect với gradient overlays
- **Buttons**: 3 variants (primary, secondary, danger)
- **Forms**: Focus states, validation, disabled states
- **Tables**: Hover effects, proper spacing
- **Tags**: Pill-shaped badges cho labels

## 📝 API Endpoints được sử dụng

### Public

- `POST /register` - Đăng ký tài khoản
- `POST /login` - Đăng nhập
- `GET /health` - Health check (requires auth)
- `POST /recommend` - Gợi ý quảng cáo (requires auth)

### Admin

- `GET /admin/ads` - Danh sách quảng cáo
- `GET /admin/ads/:id` - Chi tiết quảng cáo
- `PUT /admin/ads/:id` - Cập nhật quảng cáo
- `DELETE /admin/ads/:id` - Xóa quảng cáo
- `POST /admin/ads/upload` - Upload CSV/Excel

## 🔒 Security

- Passwords không được lưu (chỉ gửi lên server)
- Token stored securely trong localStorage
- Token expiration check
- Protected routes với authentication check
- Admin routes với role-based access
- CSRF protection qua same-origin policy

## 🐛 Debugging

### Check API Connection

1. Vào trang `/health` để kiểm tra kết nối
2. Mở DevTools > Network để xem requests
3. Check Console cho error messages

### Common Issues

- **401 Unauthorized**: Token hết hạn hoặc không hợp lệ → Đăng nhập lại
- **403 Forbidden**: Không có quyền admin → Cần tài khoản admin
- **CORS Error**: Backend chưa config CORS cho frontend origin
- **Network Error**: Backend chưa chạy hoặc URL sai

## 📄 License

This project is part of the Advertising Recommendation System.

## 🙏 Credits

Built with ❤️ using:

- React 18
- Vite
- React Router DOM
- Modern CSS with CSS Variables
