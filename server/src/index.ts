import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { getEnvVariable } from "./utils/helpers";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";

dotenv.config();
console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 3000;

["JWT_SECRET", "MONGODB_URI", "FRONT_END_URL"].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is not defined in environment variables`);
  }
});

connectDB();

app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root
app.get("/", (_req, res) => {
  res.send("Hai there, API is running...");
});

// Authentication
app.use("/api/auth", authRoutes);

// Posts
app.use("/api/posts", postRoutes);

// Centralized error handling middleware
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Error stack:", err.stack || err);
    res.status(err.status || 500).json({
      message: err.message || "Something went wrong!",
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
