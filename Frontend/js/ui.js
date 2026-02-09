export function qs(sel, parent = document) {
  return parent.querySelector(sel);
}
export function qsa(sel, parent = document) {
  return [...parent.querySelectorAll(sel)];
}

export function toast(message, type = "info") {
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.textContent = message;

  const container = document.getElementById("toast-root") || createToastRoot();
  container.appendChild(el);

  setTimeout(() => el.classList.add("show"), 10);
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 250);
  }, 2800);
}

function createToastRoot() {
  const root = document.createElement("div");
  root.id = "toast-root";
  document.body.appendChild(root);
  return root;
}

export function setNav() {
  const logged = localStorage.getItem("moviehub_token");
  const authLinks = document.getElementById("nav-auth");
  const userLinks = document.getElementById("nav-user");
  if (!authLinks || !userLinks) return;

  if (logged) {
    authLinks.classList.add("hidden");
    userLinks.classList.remove("hidden");
  } else {
    userLinks.classList.add("hidden");
    authLinks.classList.remove("hidden");
  }
}

export function requireLogin() {
  const token = localStorage.getItem("moviehub_token");
  if (!token) window.location.href = "login.html";
}
