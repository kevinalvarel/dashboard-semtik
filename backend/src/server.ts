import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth, getAllowedOrigins, Env } from "./auth";
import { authMiddleware } from "./middleware";

import attendanceRoute from "./routes/attendance.route";
import emailRoute from "./routes/email.route";

const app = new Hono<{ Bindings: Env }>();

// Global error handler to log and return clean error info
app.onError((err, c) => {
  console.error("[Worker Error]:", err);
  return c.json(
    {
      success: false,
      message: err.message || "Internal Server Error",
    },
    500
  );
});

// Inject per-request services (db, auth) into context
app.use("*", async (c, next) => {
  const { auth, db, allowedOrigins } = createAuth(c.env, c.req.url);
  c.set("services", { auth, db });
  (c as any).__allowedOrigins = allowedOrigins;
  await next();
});

// CORS
app.use("*", async (c, next) => {
  const allowedOrigins = getAllowedOrigins(c.env.FRONTEND_URL);
  return cors({
    origin: (origin) => {
      if (!origin) return origin;
      const cleanOrigin = origin.replace(/\/$/, "");
      const match = allowedOrigins.some(
        (allowed) => allowed.replace(/\/$/, "") === cleanOrigin
      );
      if (!match) {
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
      }
      return match ? origin : null;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposeHeaders: ["Set-Cookie"],
    credentials: true,
  })(c, next);
});

// Auth routes — better-auth handles /api/auth/* natively
app.all("/api/auth/*", async (c) => {
  const { auth } = c.get("services");
  return auth.handler(c.req.raw);
});

// Health check
app.get("/", (c) => {
  return c.json({ status: "ok", message: "SEMTIK API running" });
});

// Protected routes
app.get("/api/overview", authMiddleware, (c) => {
  return c.json({ user: c.get("user") });
});

app.get("/api/profile", authMiddleware, async (c) => {
  const { auth } = c.get("services");
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  return c.json(session);
});

// Feature routes
app.route("/api/attendance", attendanceRoute);
app.route("/api/emails", emailRoute);
app.route("/api/email", emailRoute);

// Cloudflare Workers ES Module export
export default app;
