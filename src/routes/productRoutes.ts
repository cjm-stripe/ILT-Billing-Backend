import express from 'express';
import { getProducts } from '../controllers/productController';

const router = express.Router();

router.get('/get-products', getProducts);

export default router;
