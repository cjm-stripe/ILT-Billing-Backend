import { Request, Response } from 'express';
import dotenv from 'dotenv';

import { stripe } from '../stripe';

dotenv.config();
export const createCheckoutSession = async (req: Request, res: Response) => {
};