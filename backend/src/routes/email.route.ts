import { Hono } from "hono";
import { Env } from "../auth";
import * as emailController from "../controller/email.controller";

const router = new Hono<{ Bindings: Env }>();

// GET /api/emails
router.get("/", (c) => {
  return c.json({
    success: true,
    message: "SEMTIK Email API is running",
    endpoints: {
      send: "POST /api/emails/send",
      sendAll: "POST /api/emails/send-all",
    },
  });
});

// GET /api/emails/send (Friendly info response when accessed via browser)
router.get("/send", (c) => {
  return c.json({
    success: true,
    message:
      "SEMTIK Send Email API is active. Please send a POST request with JSON body { email, qrCode }.",
    method: "POST",
    exampleBody: {
      email: "peserta@example.com",
      qrCode: "SEMTIK-001",
    },
  });
});

// POST /api/emails/send
router.post("/send", emailController.sendEmail);

// GET /api/emails/send-all (Friendly info response when accessed via browser)
router.get("/send-all", (c) => {
  return c.json({
    success: true,
    message:
      "SEMTIK Send All Emails API is active. Please send a POST request to send QR code emails to all participants.",
    method: "POST",
  });
});

// POST /api/emails/send-all
router.post("/send-all", emailController.sendEmailToAll);

export default router;
