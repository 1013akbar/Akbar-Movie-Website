import { apiFetch } from "./api.js";
import { requireLogin, qs, toast, setNav } from "./ui.js";
import { logout } from "./auth.js";
import { initThemeToggle } from "./theme.js";

requireLogin();
setNav();
initThemeToggle();

const logoutBtn = qs("#logoutBtn");
logoutBtn.addEventListener("click", () => {
  logout();
  toast("Logged out", "success");
  window.location.href = "index.html";
});

const pUsername = qs("#pUsername");
const pEmail = qs("#pEmail");
const pRole = qs("#pRole");
const pId = qs("#pId");

const form = qs("#profileForm");
const username = qs("#username");
const email = qs("#email");
const userErr = qs("#userErr");
const emailErr = qs("#emailErr");
const formErr = qs("#formErr");
const saveBtn = qs("#saveBtn");

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function showErr(el, msg){ el.textContent=msg; el.classList.remove("hidden"); }
function hideErr(el){ el.textContent=""; el.classList.add("hidden"); }

async function loadProfile() {
  const data = await apiFetch("/users/profile");
  const u = data.user;
  pUsername.textContent = u.username;
  pEmail.textContent = u.email;
  pRole.textContent = u.role;
  // show admin dashboard link for admins
  const adminLink = document.getElementById("adminLink");
  if (adminLink && u.role === "admin") adminLink.style.display = "inline-block";
  // apply role badge styles
  pRole.className = `role-badge ${u.role}`;
  pId.textContent = u._id || u.id || "—";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  [userErr, emailErr, formErr].forEach(hideErr);

  const un = (username.value || "").trim();
  const em = (email.value || "").trim();

  const payload = {};
  let ok = true;

  if (un && un.length < 2) { showErr(userErr, "Username must be at least 2 characters."); ok = false; }
  if (em && !validEmail(em)) { showErr(emailErr, "Please enter a valid email."); ok = false; }
  if (!ok) return;

  if (un) payload.username = un;
  if (em) payload.email = em;

  if (Object.keys(payload).length === 0) {
    showErr(formErr, "Enter at least one field to update.");
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  try {
    await apiFetch("/users/profile", { method:"PUT", body: JSON.stringify(payload) });
    toast("Profile updated", "success");
    username.value = "";
    email.value = "";
    await loadProfile();
  } catch (err) {
    showErr(formErr, err.message || "Update failed");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save changes";
  }
});

loadProfile();
