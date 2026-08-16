const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sh_token");
};

/**
 * Central fetch wrapper. Every backend response has { success, message?, ...data }.
 * Throws an Error with the backend's message on failure so callers can just
 * try/catch and show err.message.
 */
async function request(path, { method = "GET", body, isForm = false, auth = true } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok || data.success === false) {
    const message = data.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}

export const api = {
  // ---- auth ----
  register: (payload) => request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload, auth: false }),
  googleLogin: (idToken) => request("/auth/google", { method: "POST", body: { idToken }, auth: false }),
  requestOtp: (phone) => request("/auth/otp/request", { method: "POST", body: { phone }, auth: false }),
  verifyOtp: (payload) => request("/auth/otp/verify", { method: "POST", body: payload, auth: false }),
  me: () => request("/auth/me"),

  // ---- users ----
  updateMe: (payload) => request("/users/me", { method: "PATCH", body: payload }),
  updateMyLocation: (payload) => request("/users/me/location", { method: "PATCH", body: payload }),

  // ---- categories ----
  listCategories: () => request("/categories", { auth: false }),

  // ---- workers ----
  applyAsWorker: (formData) =>
    request("/workers/apply", { method: "POST", body: formData, isForm: true }),
  getNearbyWorkers: (params) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== ""))
    ).toString();
    return request(`/workers/nearby${qs ? `?${qs}` : ""}`, { auth: false });
  },
  getWorkerById: (id) => request(`/workers/${id}`, { auth: false }),
  updateMyWorkerProfile: (payload) => request("/workers/me", { method: "PATCH", body: payload }),
  getWorkerBookings: () => request("/workers/me/bookings"),

  // ---- bookings ----
  createBooking: (payload) => request("/bookings", { method: "POST", body: payload }),
  getMyBookings: () => request("/bookings/my"),
  getBookingById: (id) => request(`/bookings/${id}`),
  updateBookingStatus: (id, status) =>
    request(`/bookings/${id}/status`, { method: "PATCH", body: { status } }),
  cancelBooking: (id, reason) =>
    request(`/bookings/${id}/cancel`, { method: "PATCH", body: { reason } }),

  // ---- admin ----
  getPendingWorkers: () => request("/admin/workers/pending"),
  reviewWorker: (id, payload) =>
    request(`/admin/workers/${id}/verify`, { method: "PATCH", body: payload }),
  suspendUser: (id) => request(`/admin/users/${id}/suspend`, { method: "PATCH" }),
};

export { getToken };
