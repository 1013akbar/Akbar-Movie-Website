import { API_BASE } from "./config.js";
import { getToken, logout } from "./auth.js";
import { toast } from "./ui.js";

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) data = await res.json();

  if (res.status === 401) {
    logout();
    toast("Session expired. Please login again.", "error");
    window.location.href = "login.html";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const msg = data?.message || "Request failed";
    throw new Error(msg);
  }

  return data;
}

// ======= USERS: Profile & Management =======
export async function getUserProfile() {
  return apiFetch("/users/profile");
}

export async function updateUserProfile(updates) {
  return apiFetch("/users/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// ======= ADMIN: User Management =======
export async function getAllUsers() {
  return apiFetch("/users", { method: "GET" });
}

export async function getUserById(id) {
  return apiFetch(`/users/${id}`, { method: "GET" });
}

export async function updateUserRole(userId, role) {
  return apiFetch(`/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

export async function deleteUser(userId) {
  return apiFetch(`/users/${userId}`, { method: "DELETE" });
}

// ======= Movies (admin) =======
export async function listMovies() {
  return apiFetch(`/movies`, { method: "GET" });
}

export async function addMovie(movie) {
  return apiFetch(`/movies`, { method: "POST", body: JSON.stringify(movie) });
}

export async function removeMovie(movieId) {
  return apiFetch(`/movies/${movieId}`, { method: "DELETE" });
}

// ============ REVIEWS (admin) ============
export async function listReviews() {
  return apiFetch(`/reviews`, { method: "GET" });
}

export async function deleteReview(id) {
  return apiFetch(`/reviews/${id}`, { method: "DELETE" });
}
