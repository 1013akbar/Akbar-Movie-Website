import mongoose from "mongoose";
import Review from "../models/Review.js";

function ensureValidId(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid review id" });
    return false;
  }
  return true;
}

export async function createReview(req, res, next) {
  try {
    const review = await Review.create({ ...req.body, author: req.user._id });
    return res.status(201).json({ message: "Review created", review });
  } catch (err) { next(err); }
}

export async function listMyReviews(req, res, next) {
  try {
    // Premium users, moderators and admins can view all reviews; regular users see only their own
    const privilegedRoles = ["premium", "moderator", "admin"];
    let reviews;
    if (privilegedRoles.includes(req.user.role)) {
      reviews = await Review.find().sort({ createdAt: -1 }).populate("author", "username email");
    } else {
      reviews = await Review.find({ author: req.user._id }).sort({ createdAt: -1 }).populate("author", "username email");
    }
    return res.json({ reviews });
  } catch (err) { next(err); }
}

export async function getReviewById(req, res, next) {
  try {
    if (!ensureValidId(req.params.id, res)) return;
    const review = await Review.findById(req.params.id).populate("author", "username email");
    if (!review) return res.status(404).json({ message: "Review not found" });

    // owner-only access unless admin/moderator/premium
    const isOwner = review.author.toString() === req.user._id.toString();
    const canSee = isOwner || ["admin", "moderator", "premium"].includes(req.user.role);
    if (!canSee) return res.status(403).json({ message: "Forbidden" });

    return res.json({ review });
  } catch (err) { next(err); }
}

export async function updateReview(req, res, next) {
  try {
    if (!ensureValidId(req.params.id, res)) return;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const isOwner = review.author.toString() === req.user._id.toString();
    // Only premium owners, moderators, and admins can edit
    const canEdit = (isOwner && req.user.role === "premium") || ["admin", "moderator"].includes(req.user.role);
    if (!canEdit) return res.status(403).json({ message: "Forbidden" });

    Object.assign(review, req.body);
    await review.save();

    return res.json({ message: "Review updated", review });
  } catch (err) { next(err); }
}

export async function deleteReview(req, res, next) {
  try {
    if (!ensureValidId(req.params.id, res)) return;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const isOwner = review.author.toString() === req.user._id.toString();
    // Admin can delete any; moderators can delete any; premium owners can delete their own
    const canDelete = req.user.role === "admin" || req.user.role === "moderator" || (isOwner && req.user.role === "premium");
    if (!canDelete) return res.status(403).json({ message: "Forbidden" });

    await review.deleteOne();
    return res.json({ message: "Review deleted" });
  } catch (err) { next(err); }
}
