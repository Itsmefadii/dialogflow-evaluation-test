import express from 'express';
import webhookRouter from "./webhooks/diaglogflow.webhook.js"

const router = express.Router();

router.use("/webhook/dialogflow", webhookRouter)

export default router;