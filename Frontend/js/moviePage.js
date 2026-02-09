import { apiFetch } from "./api.js";
import { isLoggedIn, logout } from "./auth.js";
import { qs, toast, setNav } from "./ui.js";
import { initThemeToggle } from "./theme.js";

setNav();
initThemeToggle();

const logoutBtn = qs("#logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logout();
    toast("Logged out", "success");
    window.location.href = "index.html";
  });
}

const params = new URLSearchParams(location.search);
const movieId = params.get("id") || "";
const movieTitle = params.get("title") || "Movie";
const trailer = params.get("trailer") || "";
const posterUrl = params.get("poster") || "";
const year = params.get("year") || "";
const genre = params.get("genre") || "";

qs("#title").textContent = movieTitle;
qs("#poster").src = posterUrl;
qs("#poster").onerror = () => {
  qs("#poster").style.display = "none";
  qs("#poster").parentElement.style.background =
    "linear-gradient(135deg, rgba(229,9,20,.18), rgba(120,88,255,.12))";
};

qs("#meta").innerHTML = `
  ${year ? `<span class="tag">🎬 ${year}</span>` : ""}
  ${genre ? `<span class="tag">🏷️ ${genre}</span>` : ""}
  <span class="tag">⭐ Rate 1–10</span>
`;
qs("#desc").textContent = isLoggedIn() 
  ? "Play the trailer, then save your rating and review. You can manage your reviews on the My Reviews page."
  : "🎬 Preview Mode: Watch the trailer. Sign up to write reviews and rate movies!";

// Show preview warning if not logged in
if (!isLoggedIn()) {
  const banner = document.createElement("div");
  banner.style.cssText = `
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, rgba(229, 9, 20, 0.15), rgba(120, 88, 255, 0.1));
    border-bottom: 1px solid rgba(229, 9, 20, 0.3);
    padding: 12px 20px;
    text-align: center;
    font-weight: 600;
    font-size: 13px;
    z-index: 100;
  `;
  banner.innerHTML = `👁️ Preview Mode Only • <a href="register.html" style="color: rgba(229, 9, 20, 1); text-decoration: underline; cursor: pointer;">Sign up</a> to unlock all features`;
  document.body.appendChild(banner);
}

const trailerModal = qs("#trailerModal");
const trailerFrame = qs("#trailerFrame");
const trailerTitleEl = qs("#trailerTitle");

function openTrailer() {
  if (!trailer) return toast("No trailer URL available.", "error");
  trailerTitleEl.textContent = `${movieTitle} — Trailer`;
  trailerFrame.src = trailer + "?autoplay=1";
  trailerModal.classList.add("show");
  trailerModal.setAttribute("aria-hidden", "false");
}
function closeTrailer() {
  trailerModal.classList.remove("show");
  trailerModal.setAttribute("aria-hidden", "true");
  trailerFrame.src = "";
}

qs("#playTrailer").addEventListener("click", openTrailer);
qs("#closeTrailer").addEventListener("click", closeTrailer);
trailerModal.addEventListener("click", (e) => { if (e.target === trailerModal) closeTrailer(); });

/* Rating stars 1-10 */
const starsEl = qs("#stars");
let rating = 0;

function renderStars() {
  starsEl.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `star ${i <= rating ? "active" : ""}`;
    b.textContent = i;
    b.addEventListener("click", () => {
      rating = i;
      renderStars();
      hideErr(qs("#ratingErr"));
    });
    starsEl.appendChild(b);
  }
}
renderStars();

function showErr(el, msg){ el.textContent = msg; el.classList.remove("hidden"); }
function hideErr(el){ el.textContent = ""; el.classList.add("hidden"); }

const form = qs("#reviewForm");
const reviewText = qs("#reviewText");
const spoilers = qs("#spoilers");
const saveBtn = qs("#saveReviewBtn");
const formErr = qs("#formErr");

// Disable review form for non-logged-in users
if (!isLoggedIn()) {
  const formSection = form.parentElement.parentElement;
  formSection.style.position = "relative";
  
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(11, 11, 15, 0.98) 65%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    z-index: 20;
    backdrop-filter: blur(2px);
  `;
  
  const blocker = document.createElement("div");
  blocker.style.cssText = `
    text-align: center;
    background: rgba(18, 18, 26, 0.95);
    border: 1px solid rgba(229, 9, 20, 0.2);
    border-radius: 12px;
    padding: 28px;
    max-width: 320px;
  `;
  
  blocker.innerHTML = `
    <div style="font-size: 36px; margin-bottom: 12px;">📝</div>
    <h3 style="margin: 0 0 10px; font-size: 18px; font-weight: 700;">Create an Account</h3>
    <p style="margin: 0 0 18px; font-size: 13px; color: rgba(245, 245, 247, 0.65); line-height: 1.5;">
      Sign up to write reviews and rate this movie!
    </p>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <a href="register.html" class="btn btn--primary" style="text-decoration: none; display: block; font-size: 13px;">Create Account</a>
      <a href="login.html" class="btn btn--ghost" style="text-decoration: none; display: block; font-size: 13px;">Login</a>
    </div>
  `;
  
  overlay.appendChild(blocker);
  formSection.appendChild(overlay);
  
  // Disable all form inputs
  const inputs = form.querySelectorAll("input, textarea, button");
  inputs.forEach(input => input.disabled = true);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideErr(formErr);

  if (!isLoggedIn()) {
    toast("Please login first.", "error");
    window.location.href = "login.html";
    return;
  }

  if (rating < 1 || rating > 10) {
    showErr(qs("#ratingErr"), "Please select rating from 1 to 10.");
    return;
  }

  const text = (reviewText.value || "").trim();
  if (text.length > 2000) {
    showErr(formErr, "Review is too long (max 2000 chars).");
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  try {
    await apiFetch("/reviews", {
      method: "POST",
      body: JSON.stringify({
        movieId,
        movieTitle,
        rating,
        reviewText: text,
        containsSpoilers: !!spoilers.checked
      })
    });

    toast("Review saved!", "success");
    reviewText.value = "";
    spoilers.checked = false;
    rating = 0;
    renderStars();
  } catch (err) {
    showErr(formErr, err.message || "Failed to save review");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save review";
  }
});
