import { apiFetch } from "./api.js";
import { saveAuth } from "./auth.js";
import { qs, toast } from "./ui.js";
import { initThemeToggle } from "./theme.js";

initThemeToggle();

const loginForm = qs("#loginForm");
if (loginForm) setupLogin();

const registerForm = qs("#registerForm");
if (registerForm) setupRegister();

function showErr(el, msg) {
  el.textContent = msg;
  el.classList.remove("hidden");
}
function hideErr(el) {
  el.textContent = "";
  el.classList.add("hidden");
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setupLogin() {
  const email = qs("#email");
  const password = qs("#password");
  const emailErr = qs("#emailErr");
  const passErr = qs("#passErr");
  const formErr = qs("#formErr");
  const btn = qs("#loginBtn");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideErr(emailErr); hideErr(passErr); hideErr(formErr);

    const em = (email.value || "").trim();
    const pw = password.value || "";
    const loginRole = qs("#loginRole")?.value || "user";

    let ok = true;
    if (!validEmail(em)) { showErr(emailErr, "Please enter a valid email."); ok = false; }
    if (pw.length < 6) { showErr(passErr, "Password must be at least 6 characters."); ok = false; }
    if (!ok) return;

    btn.disabled = true;
    btn.textContent = "Logging in...";

    try {
        console.log("[authPages] submit login", { email: em, role: loginRole });
        const data = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: em, password: pw, role: loginRole })
        });

        console.log("[authPages] login response", data);

        saveAuth(data.token, data.user);
        toast("Login successful!", "success");
        // Redirect admin users straight to admin dashboard
        try {
          const role = data.user?.role;
          if (role === "admin") {
            window.location.href = "admin-dashboard.html";
          } else {
            window.location.href = "index.html";
          }
        } catch (err) {
          window.location.href = "index.html";
        }
    } catch (err) {
        console.error("[authPages] login error", err);
        showErr(formErr, err.message || "Login failed");
    } finally {
      btn.disabled = false;
      btn.textContent = "Login";
    }
  });
}

function setupRegister() {
  const username = qs("#username");
  const email = qs("#email");
  const password = qs("#password");
  const confirm = qs("#confirm");

  const userErr = qs("#userErr");
  const emailErr = qs("#emailErr");
  const passErr = qs("#passErr");
  const confErr = qs("#confErr");
  const formErr = qs("#formErr");
  const btn = qs("#registerBtn");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    [userErr, emailErr, passErr, confErr, formErr].forEach(hideErr);

    const un = (username.value || "").trim();
    const em = (email.value || "").trim();
    const pw = password.value || "";
    const cpw = confirm.value || "";

    let ok = true;
    if (un.length < 2) { showErr(userErr, "Username must be at least 2 characters."); ok = false; }
    if (!validEmail(em)) { showErr(emailErr, "Please enter a valid email."); ok = false; }
    if (pw.length < 6) { showErr(passErr, "Password must be at least 6 characters."); ok = false; }
    if (pw !== cpw) { showErr(confErr, "Passwords do not match."); ok = false; }
    if (!ok) return;

    btn.disabled = true;
    btn.textContent = "Creating account...";

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username: un, email: em, password: pw, role: "user" })
      });

      toast("Registered! Check your email to verify your account.", "success");
      // Redirect to verification page with email for resend option
      window.location.href = `verify.html?email=${encodeURIComponent(em)}`;
    } catch (err) {
      showErr(formErr, err.message || "Registration failed");
    } finally {
      btn.disabled = false;
      btn.textContent = "Register";
    }
  });
}
