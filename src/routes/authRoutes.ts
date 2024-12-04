import express from 'express';
import { signIn, signUp, generateToken } from '../controllers/authController';

const router = express.Router();

router.post('/sign-in', signIn);
router.post('/sign-up', signUp);
router.post('/generate-token', generateToken);


export default router;