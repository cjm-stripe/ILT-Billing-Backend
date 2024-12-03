import express from 'express';
import { getCustomer } from '../controllers/customerController';

const router = express.Router();

router.get('/get-customer/:id', getCustomer);

export default router;
