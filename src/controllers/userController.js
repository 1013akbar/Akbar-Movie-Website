import mongoose from "mongoose";
import User from "../models/User.js";

export async function getProfile(req, res) {
  return res.json({ user: req.user });
}

export async function updateProfile(req, res, next) {
  try {
    const { username, email } = req.body;
    // if changing email, ensure unique
    if (email && email !== req.user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ message: "Email already in use" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { ...(username && { username }), ...(email && { email }) },
      { new: true }
    ).select("-password");

    return res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    next(err);
  }
}

// ============ Admin: User Management ============
export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (!["user", "admin", "premium", "moderator"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // If assigning admin, ensure no other admin exists (or it's the same user)
    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin && existingAdmin._id.toString() !== id) {
        return res.status(403).json({ message: "An admin account already exists" });
      }
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User role updated", user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    // Prevent deleting self
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
}
