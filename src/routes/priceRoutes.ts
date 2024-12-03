import express from 'express';
import { getPrices } from '../controllers/priceController';

const router = express.Router();

router.get('/get-prices', getPrices);

export default router;
