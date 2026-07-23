import "dotenv/config";
import express from "express";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";

import { auth, allowedOrigins } from "./auth";
import { authMiddleware } from "./middleware";

import attendanceRoute from "./routes/attendance.route";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.some((allowed) => allowed.replace(/\/$/, "") === cleanOrigin)) {
        return callback(null, true);
      }

      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
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
  console.log(`Server running on port ${port}`);
  console.log(`Allowed CORS origins:`, allowedOrigins);
});

