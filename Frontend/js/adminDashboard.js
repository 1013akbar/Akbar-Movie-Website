import { getUser, logout } from "./auth.js";
import { qs, toast } from "./ui.js";
import { getAllUsers, updateUserRole, deleteUser, listReviews, deleteReview } from "./api.js";
import { initThemeToggle } from "./theme.js";

initThemeToggle();

const me = getUser();
if (!me || me.role !== "admin") {
  alert("Access denied: admin only");
  window.location.href = "index.html";
}

const usersList = qs("#usersList");
const reviewsList = qs("#reviewsList");
const logoutBtn = qs("#logoutBtn");
const refreshBtn = qs("#refreshBtn");

logoutBtn?.addEventListener("click", () => { logout(); window.location.href = "login.html"; });
refreshBtn?.addEventListener("click", () => { refreshUsers(); refreshReviews(); });

async function refreshUsers() {
  usersList.innerHTML = `<div class="center"><div class="spinner"></div><div class="muted">Loading users…</div></div>`;
  try {
    const res = await getAllUsers();
    const users = res.users || res;
    if (!users || users.length === 0) {
      usersList.textContent = "No users found.";
      return;
    }

    const container = document.createElement("div");
    container.className = "admin-list";
    users.forEach(u => {
      const entry = document.createElement("div");
      entry.className = "admin-list__row";
      const name = document.createElement("div");
      name.innerHTML = `<strong>${u.username}</strong><div class="muted">${u.email}</div>`;

      const controls = document.createElement("div");
      controls.style.display = "flex";
      controls.style.gap = "8px";

      const roleSel = document.createElement("select");
      ["user","premium","moderator","admin"].forEach(r => {
        const opt = document.createElement("option");
        opt.value = r; opt.textContent = r.charAt(0).toUpperCase() + r.slice(1);
        if (u.role === r) opt.selected = true;
        roleSel.appendChild(opt);
      });
      roleSel.addEventListener("change", async () => {
        if (!confirm(`Change role of ${u.email} to ${roleSel.value}?`)) { roleSel.value = u.role; return; }
        try {
          await updateUserRole(u._id, roleSel.value);
          toast("Role updated", "success");
          refreshUsers();
        } catch (err) {
          toast(err.message || "Failed to update role", "error");
          roleSel.value = u.role;
        }
      });

      const del = document.createElement("button");
      del.className = "btn btn--danger";
      del.textContent = "Delete";
      del.addEventListener("click", async () => {
        if (!confirm(`Delete user ${u.email}?`)) return;
        try { await deleteUser(u._id); toast("User deleted", "success"); refreshUsers(); }
        catch (err) { toast(err.message || "Failed", "error"); }
      });

      controls.appendChild(roleSel);
      controls.appendChild(del);

      entry.appendChild(name);
      entry.appendChild(controls);
      container.appendChild(entry);
    });

    usersList.innerHTML = "";
    usersList.appendChild(container);
  } catch (err) {
    console.error("Failed to load users", err);
    usersList.innerHTML = `<div class="error-box">Failed to load users: ${err.message || ''} <button id="retryUsers" class="btn btn--ghost" style="margin-left:12px">Retry</button></div>`;
    qs('#retryUsers')?.addEventListener('click', refreshUsers);
  }
}

async function refreshReviews() {
  reviewsList.innerHTML = `<div class="center"><div class="spinner"></div><div class="muted">Loading reviews…</div></div>`;
  try {
    const res = await listReviews();
    const reviews = res.reviews || res;
    if (!reviews || reviews.length === 0) {
      reviewsList.textContent = "No reviews found.";
      return;
    }

    const container = document.createElement("div");
    container.className = "admin-list";
    reviews.forEach(r => {
      const entry = document.createElement("div");
      entry.className = "admin-list__row";
      const authorText = r.author?.email ? `${r.author.username} <${r.author.email}>` : (r.author || r.authorEmail || "unknown");
      const body = document.createElement("div");
      body.innerHTML = `<strong>${r.movieTitle}</strong><div class="muted">by ${authorText}</div><div>${r.reviewText || ''}</div>`;

      const controls = document.createElement("div");
      const del = document.createElement("button");
      del.className = "btn btn--danger";
      del.textContent = "Delete";
      del.addEventListener("click", async () => {
        if (!confirm(`Delete review ${r._id}?`)) return;
        try { await deleteReview(r._id); toast("Review deleted", "success"); refreshReviews(); }
        catch (err) { toast(err.message || "Failed", "error"); }
      });
      controls.appendChild(del);

      entry.appendChild(body);
      entry.appendChild(controls);
      container.appendChild(entry);
    });

    reviewsList.innerHTML = "";
    reviewsList.appendChild(container);
  } catch (err) {
    console.error("Failed to load reviews", err);
    reviewsList.innerHTML = `<div class="error-box">Failed to load reviews: ${err.message || ''} <button id="retryReviews" class="btn btn--ghost" style="margin-left:12px">Retry</button></div>`;
    qs('#retryReviews')?.addEventListener('click', refreshReviews);
  }
}

refreshUsers();
refreshReviews();

// simple client-side filter for users
// search removed per request
