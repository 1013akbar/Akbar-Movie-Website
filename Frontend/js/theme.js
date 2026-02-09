import { qs } from "./ui.js";

export function initThemeToggle() {
  const icon = qs("#themeIcon");
  const btn = qs("#themeToggle");

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("moviehub_theme", theme);
    if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
  }

  const saved = localStorage.getItem("moviehub_theme") || "dark";
  apply(saved);

  if (btn) {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      apply(current === "dark" ? "light" : "dark");
    });
  }
}
