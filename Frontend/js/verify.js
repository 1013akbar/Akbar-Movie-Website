import { apiFetch } from "./api.js";
import { qs, toast } from "./ui.js";

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
const email = urlParams.get("email");

const verifyContent = qs("#verifyContent");
const verificationResult = qs("#verificationResult");
const resultMessage = qs("#resultMessage");
const resendSection = qs("#resendSection");
const resendBtn = qs("#resendBtn");
const resendMessage = qs("#resendMessage");
const resendTimer = qs("#resendTimer");

let resendCountdown = 0;

async function verifyEmail() {
  try {
    if (!token) {
      showError("No verification token provided. Please check the link in your email.");
      showResendOption();
      return;
    }

    const data = await apiFetch(`/auth/verify?token=${token}`, {
      method: "GET",
    });

    showSuccess(
      "✅ Email Verified Successfully!",
      "Your email has been verified. You can now login to your account."
    );

    // Auto redirect after 3 seconds
    setTimeout(() => {
      window.location.href = "login.html";
    }, 3000);
  } catch (err) {
    console.error("[verify] verification error", err);
    
    if (err.message.includes("expired")) {
      showError(err.message);
      showResendOption();
    } else {
      showError(err.message || "Failed to verify email. Please try again.");
      showResendOption();
    }
  }
}

function showSuccess(title, message) {
  verifyContent.style.display = "none";
  resendSection.style.display = "none";
  verificationResult.style.display = "block";

  const successMsg = document.createElement("div");
  successMsg.className = "verify-message success";
  successMsg.innerHTML = `<strong>${title}</strong><br>${message}`;
  resultMessage.innerHTML = "";
  resultMessage.appendChild(successMsg);
}

function showError(message) {
  verifyContent.style.display = "none";
  verificationResult.style.display = "block";

  const errorMsg = document.createElement("div");
  errorMsg.className = "verify-message error";
  errorMsg.innerHTML = `<strong>❌ Verification Failed</strong><br>${message}`;
  resultMessage.innerHTML = "";
  resultMessage.appendChild(errorMsg);
}

function showResendOption() {
  resendSection.style.display = "block";
  
  if (!email) {
    resendSection.style.display = "none";
    return;
  }

  resendBtn.addEventListener("click", async () => {
    resendBtn.disabled = true;
    resendBtn.textContent = "Sending...";

    try {
      // This endpoint would need to be created to allow resending verification emails
      await apiFetch("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      resendMessage.innerHTML = '<div class="verify-message success">Verification email sent! Check your inbox.</div>';
      startResendCountdown();
    } catch (err) {
      resendMessage.innerHTML = `<div class="verify-message error">Failed to resend: ${err.message}</div>`;
      resendBtn.disabled = false;
      resendBtn.textContent = "Resend Verification Email";
    }
  });
}

function startResendCountdown() {
  resendCountdown = 60;
  resendBtn.disabled = true;

  const countdown = setInterval(() => {
    resendCountdown--;
    resendTimer.textContent = `You can resend again in ${resendCountdown}s`;

    if (resendCountdown === 0) {
      clearInterval(countdown);
      resendBtn.disabled = false;
      resendBtn.textContent = "Resend Verification Email";
      resendTimer.textContent = "";
    }
  }, 1000);
}

// Start verification on page load
verifyEmail();
