import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin", "premium", "moderator"], default: "user" },
    // Email verification fields
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    // optional payment info (store only non-sensitive summary)
    paymentLast4: { type: String },
    premiumSince: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
