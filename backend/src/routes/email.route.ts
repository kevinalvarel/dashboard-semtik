import { Router } from "express";
import * as emailController from "../controller/email.controller";

const router = Router();

// POST /api/emails/send
router.post("/send", emailController.sendEmail);

// POST /api/emails/send-all
router.post("/send-all", emailController.sendEmailToAll);

export default router;
