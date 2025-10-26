import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/app.css";
import App from "./App.jsx";
import { AuthProvider } from "./hooks/useAuth.js";
import { ThemeProvider } from "./hooks/useTheme.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Recommend from "./pages/Recommend.jsx";
import Profile from "./pages/Profile.jsx";
import Health from "./pages/Health.jsx";
import AdminAds from "./pages/AdminAds.jsx";
import AdminAdEdit from "./pages/AdminAdEdit.jsx";
import CreateAd from "./pages/CreateAd.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Recommend />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="health" element={<Health />} />
              <Route
                path="admin/ads"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminAds />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/ads/create"
                element={
                  <ProtectedRoute requireAdmin>
                    <CreateAd />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/ads/:id"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminAdEdit />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
