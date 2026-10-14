import { Hono } from "hono";
import { Env } from "../auth";
import * as emailController from "../controller/email.controller";

const router = new Hono<{ Bindings: Env }>();

// POST /api/emails/send
router.post("/send", emailController.sendEmail);

// POST /api/emails/send-all
router.post("/send-all", emailController.sendEmailToAll);

export default router;
