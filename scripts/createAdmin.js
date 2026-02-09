import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/movie";

await connectDB(MONGO_URI);

const email = "admin@gmail.com";
const password = "admin123";
const username = "admin";

try {
  let admin = await User.findOne({ role: "admin" });
  if (!admin) {
    const hash = await bcrypt.hash(password, 10);
    admin = await User.create({ username, email, password: hash, role: "admin" });
    console.log("Created admin:", admin._id.toString());
  } else {
    // Update existing admin to use provided credentials
    admin.email = email;
    admin.username = username;
    admin.password = await bcrypt.hash(password, 10);
    await admin.save();
    console.log("Updated existing admin:", admin._id.toString());
  }
} catch (err) {
  console.error("Failed to create/update admin:", err);
  process.exit(1);
}

process.exit(0);
