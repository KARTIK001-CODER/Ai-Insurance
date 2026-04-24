import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", recommendationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});