import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import crypto from "crypto";

export async function register(req, res, next) {
  try {
    const { username, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    // Validate role if provided
    const allowed = ["user", "premium", "moderator", "admin"];
    let assignedRole = "user";
    if (role && allowed.includes(role)) assignedRole = role;

    // Enforce single-admin policy: only allow creating 'admin' if none exists
    if (assignedRole === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount > 0) {
        // Do not allow creating another admin
        return res.status(403).json({ message: "An admin account already exists" });
      }
    }

    // If premium, expect card info and store only last4 and premiumSince
    let paymentLast4 = undefined;
    if (assignedRole === "premium") {
      const { cardNumber } = req.body;
      if (!cardNumber || cardNumber.length < 4) {
        return res.status(400).json({ message: "Invalid card info" });
      }
      paymentLast4 = cardNumber.slice(-4);
    }

    const hash = await bcrypt.hash(password, 10);
    
    // Generate verification token (valid for 24 hours)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const user = await User.create({
      username,
      email,
      password: hash,
      role: assignedRole,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
      ...(paymentLast4 && { paymentLast4, premiumSince: new Date() }),
    });

    // Send verification email
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify.html?token=${verificationToken}&email=${email}`;
      await sendVerificationEmail(email, username, verificationUrl);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // Delete user if email fails (optional: you could keep user and retry later)
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    return res.status(201).json({ 
      message: "Registered successfully. Please check your email to verify your account.",
      userId: user._id,
      email: user.email 
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    // Validate role matches
    const requestedRole = role || "user";
    if (requestedRole === "admin" && user.role !== "admin") {
      return res.status(403).json({ message: "This account is not an admin account" });
    }
    if (requestedRole === "user" && user.role === "admin") {
      return res.status(403).json({ message: "Admin accounts must login as admin" });
    }

    const token = signToken({ sub: user._id.toString(), role: user.role }, "7d");

    return res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return res.json({ message: "Email verified successfully. You can now login." });
  } catch (err) {
    next(err);
  }
}

export async function resendVerification(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({ message: "If this email exists, a verification email has been sent" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "This email is already verified" });
    }

    // Generate new verification token (valid for 24 hours)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Send verification email
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify.html?token=${verificationToken}&email=${email}`;
      await sendVerificationEmail(email, user.username, verificationUrl);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    return res.json({ message: "Verification email sent successfully" });
  } catch (err) {
    next(err);
  }
}
