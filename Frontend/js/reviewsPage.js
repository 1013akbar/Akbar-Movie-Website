import { apiFetch } from "./api.js";
import { requireLogin, qs, toast, setNav } from "./ui.js";
import { logout } from "./auth.js";
import { initThemeToggle } from "./theme.js";

requireLogin();
setNav();
initThemeToggle();

qs("#logoutBtn").addEventListener("click", () => {
  logout();
  toast("Logged out", "success");
  window.location.href = "index.html";
});

const rows = qs("#rows");
const empty = qs("#empty");
const errEl = qs("#err");

/* edit modal elements */
const editModal = qs("#editModal");
const closeEdit = qs("#closeEdit");
const editTitle = qs("#editTitle");
const editForm = qs("#editForm");
const editRating = qs("#editRating");
const editText = qs("#editText");
const editSpoilers = qs("#editSpoilers");
const saveEditBtn = qs("#saveEditBtn");
const editErr = qs("#editErr");

let currentEditId = null;
let currentEditMovieTitle = "";

function showErr(el, msg){ el.textContent=msg; el.classList.remove("hidden"); }
function hideErr(el){ el.textContent=""; el.classList.add("hidden"); }

function openEdit(review) {
  currentEditId = review._id;
  currentEditMovieTitle = review.movieTitle;
  editTitle.textContent = `Edit — ${review.movieTitle}`;
  editRating.value = review.rating;
  editText.value = review.reviewText || "";
  editSpoilers.checked = !!review.containsSpoilers;
  hideErr(editErr);
  editModal.classList.add("show");
  editModal.setAttribute("aria-hidden", "false");
}

function closeEditModal() {
  editModal.classList.remove("show");
  editModal.setAttribute("aria-hidden", "true");
  currentEditId = null;
  currentEditMovieTitle = "";
}

closeEdit.addEventListener("click", closeEditModal);
editModal.addEventListener("click", (e) => { if (e.target === editModal) closeEditModal(); });

async function load() {
  hideErr(errEl);
  rows.innerHTML = "";

  try {
    const data = await apiFetch("/reviews");
    const list = data.reviews || [];

    if (list.length === 0) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");

    rows.innerHTML = list.map(r => {
      const updated = new Date(r.updatedAt || r.createdAt).toLocaleString();
      return `
        <tr>
          <td>${r.movieTitle}</td>
          <td>${r.rating}</td>
          <td>${r.containsSpoilers ? "Yes" : "No"}</td>
          <td>${updated}</td>
          <td>
            <div class="actions">
              <button class="btn small btn--ghost" data-edit="${r._id}">Edit</button>
              <button class="btn small btn--danger" data-del="${r._id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // attach handlers
    rows.querySelectorAll("[data-edit]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-edit");
        const review = list.find(x => x._id === id);
        openEdit(review);
      });
    });

    rows.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-del");
        const review = list.find(x => x._id === id);
        const ok = confirm(`Delete your review for "${review.movieTitle}"?`);
        if (!ok) return;

        try {
          await apiFetch(`/reviews/${id}`, { method: "DELETE" });
          toast("Review deleted", "success");
          load();
        } catch (err) {
          toast(err.message || "Delete failed", "error");
        }
      });
    });

  } catch (err) {
    showErr(errEl, err.message || "Failed to load reviews");
  }
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideErr(editErr);

  const rating = Number(editRating.value);
  if (!Number.isFinite(rating) || rating < 1 || rating > 10) {
    showErr(editErr, "Rating must be between 1 and 10.");
    return;
  }
  const text = (editText.value || "").trim();
  if (text.length > 2000) {
    showErr(editErr, "Review is too long (max 2000 chars).");
    return;
  }
  if (!currentEditId) return;

  saveEditBtn.disabled = true;
  saveEditBtn.textContent = "Saving...";

  try {
    await apiFetch(`/reviews/${currentEditId}`, {
      method: "PUT",
      body: JSON.stringify({
        rating,
        reviewText: text,
        containsSpoilers: !!editSpoilers.checked
      })
    });
    toast(`Updated: ${currentEditMovieTitle}`, "success");
    closeEditModal();
    load();
  } catch (err) {
    showErr(editErr, err.message || "Update failed");
  } finally {
    saveEditBtn.disabled = false;
    saveEditBtn.textContent = "Save changes";
  }
});

load();
