const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sh_token");
};

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
    cache: "no-store",
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
  updateMe: (payload) => request("/customer/profile", { method: "PATCH", body: payload }),
  getMyProfile: () => request("/customer/profile"),
  updateMyLocation: (payload) => request("/users/me/location", { method: "PATCH", body: payload }),
  getMyLocation: () => request("/users/me/location"),

  // ---- categories ----
  listCategories: () => request("/categories", { auth: false }),

  // ---- workers / workerProfile ----
  applyAsWorker: (formData) => request("/workers/apply", { method: "POST", body: formData, isForm: true }),
  getWorkerProfile: () => request("/worker/profile"),
  updateWorkerProfile: (payloadOrFormData) => {
    const isForm = payloadOrFormData instanceof FormData;
    return request("/worker/profile", {
      method: "PATCH",
      body: payloadOrFormData,
      isForm,
    });
  },
  updateWorkerSettings: (payloadOrFormData) => api.updateWorkerProfile(payloadOrFormData),
  uploadWorkerPhoto: (formData) => request("/worker/profile/photo", { method: "POST", body: formData, isForm: true }),
  updateWorkerAvailability: (payload) => request("/worker/availability", { method: "PATCH", body: payload }),
  getWorkerBookings: () => request("/worker/bookings"),
  acceptWorkerBooking: (id) => request(`/worker/bookings/${id}/accept`, { method: "PATCH" }),
  rejectWorkerBooking: (id) => request(`/worker/bookings/${id}/reject`, { method: "PATCH" }),
  completeWorkerBooking: (id) => request(`/worker/bookings/${id}/complete`, { method: "PATCH" }),

  // ---- worker search ----
  getWorkers: (params) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== ""))
    ).toString();
    return request(`/workers${qs ? `?${qs}` : ""}`, { auth: false });
  },
  getNearbyWorkers: (params) => api.getWorkers(params),
  getWorkerById: (id) => request(`/workers/${id}`, { auth: false }),

  // ---- bookings ----
  createBooking: (payload) => request("/bookings", { method: "POST", body: payload }),
  getMyBookings: () => request("/bookings/my"),
  getBookingById: (id) => request(`/bookings/${id}`),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: "PATCH", body: { status } }),
  cancelBooking: (id, reason) => request(`/bookings/${id}/cancel`, { method: "PATCH", body: { reason } }),

  // ---- admin worker management ----
  getWorkerApplications: () => request("/admin/worker-applications"),
  getPendingWorkers: () => request("/admin/worker-applications"),
  approveWorker: (id) => request(`/admin/workers/${id}/approve`, { method: "PATCH" }),
  rejectWorker: (id) => request(`/admin/workers/${id}/reject`, { method: "PATCH" }),
  suspendWorker: (id) => request(`/admin/workers/${id}/suspend`, { method: "PATCH" }),
  activateWorker: (id) => request(`/admin/workers/${id}/activate`, { method: "PATCH" }),
  reviewWorker: (id, payload) => {
    const action = payload?.status || payload?.action;
    if (action === "approved" || action === "approve") return api.approveWorker(id);
    if (action === "rejected" || action === "reject") return api.rejectWorker(id);
    if (action === "suspended" || action === "suspend") return api.suspendWorker(id);
    if (action === "activated" || action === "activate") return api.activateWorker(id);
    return request(`/admin/workers/${id}/approve`, { method: "PATCH", body: payload });
  },
  suspendUser: (id) => request(`/admin/users/${id}/suspend`, { method: "PATCH" }),
};

export { getToken };
