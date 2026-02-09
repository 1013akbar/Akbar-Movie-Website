import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
