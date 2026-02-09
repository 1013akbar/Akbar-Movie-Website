import axios from "axios";

// Using Mailgun API instead of SMTP
export async function sendVerificationEmail(email, username, verificationUrl) {
  try {
    const domain = process.env.MAILGUN_DOMAIN || "sandboxd38f0cf817a1489c8a383121d9ddef1e.mailgun.org";
    const apiKey = process.env.MAILGUN_SMTP_API_KEY;
    
    const params = new URLSearchParams();
    params.append("from", process.env.EMAIL_FROM || "noreply@moviereview.com");
    params.append("to", email);
    params.append("subject", "Email Verification - Movie Review Platform");
    params.append("html", `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome, ${username}!</h2>
        <p style="color: #666; font-size: 16px;">
          Thank you for signing up. Please verify your email address to activate your account.
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${verificationUrl}" style="
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            display: inline-block;
          ">
            Verify Email
          </a>
        </div>
        
        <p style="color: #999; font-size: 14px;">
          Or copy and paste this link in your browser:
        </p>
        <p style="color: #007bff; word-break: break-all; font-size: 14px;">
          ${verificationUrl}
        </p>
        
        <p style="color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
          This link will expire in 24 hours.<br/>
          If you didn't sign up for this account, you can safely ignore this email.
        </p>
      </div>
    `);
    
    const response = await axios.post(
      `https://api.mailgun.net/v3/${domain}/messages`,
      params,
      {
        auth: {
          username: "api",
          password: apiKey,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Mailgun API error:", error.response?.data || error.message);
    throw error;
  }
}

export async function sendWelcomeEmail(email, username) {
  try {
    const domain = process.env.MAILGUN_DOMAIN || "sandboxd38f0cf817a1489c8a383121d9ddef1e.mailgun.org";
    const apiKey = process.env.MAILGUN_SMTP_API_KEY;
    
    const params = new URLSearchParams();
    params.append("from", process.env.EMAIL_FROM || "noreply@moviereview.com");
    params.append("to", email);
    params.append("subject", "Welcome to Movie Review Platform!");
    params.append("html", `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome, ${username}!</h2>
        <p style="color: #666; font-size: 16px;">
          Your account is now active. Start exploring movies and sharing your reviews!
        </p>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #333;">Quick Links:</h3>
          <ul style="color: #666;">
            <li><a href="${process.env.FRONTEND_URL}/index.html" style="color: #007bff;">Go to Home</a></li>
            <li><a href="${process.env.FRONTEND_URL}/movie.html" style="color: #007bff;">Browse Movies</a></li>
            <li><a href="${process.env.FRONTEND_URL}/profile.html" style="color: #007bff;">Complete Your Profile</a></li>
          </ul>
        </div>
        
        <p style="color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
          Happy reviewing!<br/>
          The Movie Review Team
        </p>
      </div>
    `);
    
    const response = await axios.post(
      `https://api.mailgun.net/v3/${domain}/messages`,
      params,
      {
        auth: {
          username: "api",
          password: apiKey,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Mailgun API error:", error.response?.data || error.message);
    throw error;
  }
}
