import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true, index: true },
    movieTitle: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    reviewText: { type: String, trim: true, maxlength: 2000 },
    containsSpoilers: { type: Boolean, default: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
