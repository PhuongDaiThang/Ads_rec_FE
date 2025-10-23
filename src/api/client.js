const BASE = (import.meta.env.VITE_API_BASE ?? "http://localhost:8000").replace(
  /\/$/,
  ""
);

// Helper to get auth token from localStorage
function getAuthToken() {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "bearer";
  return token ? `${tokenType} ${token}` : null;
}

// Helper to build headers
function headers(auth = false) {
  const h = {
    Accept: "application/json",
  };

  if (auth) {
    const authHeader = getAuthToken();
    if (authHeader) {
      h["Authorization"] = authHeader;
    }
  }

  return h;
}

// Helper to handle response
async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg =
        errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      const text = await response.text();
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }

  // 204 No Content has no body
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Health check - requires authentication
export async function apiHealth() {
  const r = await fetch(`${BASE}/health`, {
    headers: headers(true),
  });
  return handleResponse(r);
}

// ============= AUTH APIs =============

export async function apiRegister(data) {
  const r = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(r);
}

export async function apiLogin(data) {
  const r = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(r);
}

// ============= PUBLIC APIs =============

export async function apiRecommend(data) {
  const r = await fetch(`${BASE}/recommend`, {
    method: "POST",
    headers: {
      ...headers(true),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(r);
}

// ============= PROFILE APIs =============

export async function apiGetProfile() {
  const r = await fetch(`${BASE}/profile/me`, {
    headers: headers(true),
  });
  return handleResponse(r);
}

export async function apiCreateOrUpdateProfile(data) {
  const r = await fetch(`${BASE}/profile/me`, {
    method: "POST",
    headers: {
      ...headers(true),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(r);
}

export async function apiPatchProfile(data) {
  const r = await fetch(`${BASE}/profile/me`, {
    method: "PATCH",
    headers: {
      ...headers(true),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(r);
}

export async function apiDeleteProfile() {
  const r = await fetch(`${BASE}/profile/me`, {
    method: "DELETE",
    headers: headers(true),
  });
  return handleResponse(r);
}

export async function apiRecommendByProfile(limit = 5) {
  const r = await fetch(`${BASE}/recommend/profile`, {
    method: "POST",
    headers: {
      ...headers(true),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ limit }),
  });
  return handleResponse(r);
}

// ============= ADMIN APIs =============

export async function apiListAds() {
  const r = await fetch(`${BASE}/admin/ads`, {
    headers: headers(true),
  });
  return handleResponse(r);
}

export async function apiGetAd(id) {
  const r = await fetch(`${BASE}/admin/ads/${id}`, {
    headers: headers(true),
  });
  return handleResponse(r);
}

export async function apiUpdateAd(id, payload) {
  const r = await fetch(`${BASE}/admin/ads/${id}`, {
    method: "PUT",
    headers: {
      ...headers(true),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(r);
}

export async function apiDeleteAd(id) {
  const r = await fetch(`${BASE}/admin/ads/${id}`, {
    method: "DELETE",
    headers: headers(true),
  });
  return handleResponse(r);
}

export async function apiUploadAds(file) {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${BASE}/admin/ads/upload`, {
    method: "POST",
    headers: headers(true),
    // Don't set Content-Type - browser will set it with boundary for multipart/form-data
    body: fd,
  });
  return handleResponse(r);
}
