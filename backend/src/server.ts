import "dotenv/config";
import express from "express";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";

import { auth } from "./auth";
import { authMiddleware } from "./middleware";

import attendanceRoute from "./routes/attendance.route";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "SEMTIK API running" });
});

app.get("/api/overview", authMiddleware, (req, res) => {
  res.json({
    user: (req as any).user,
  });
});

app.get("/api/profile", authMiddleware, async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.use("/api/attendance", attendanceRoute);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Auth endpoints: http://localhost:${port}/api/auth`);
});
