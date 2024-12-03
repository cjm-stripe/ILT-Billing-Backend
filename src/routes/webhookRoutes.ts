import express from 'express';
import { handleCheckoutWebhook } from '../controllers/webhookController';

const router = express.Router();

router.post('/checkout', express.raw({type: 'application/json'}), handleCheckoutWebhook);

export default router;
