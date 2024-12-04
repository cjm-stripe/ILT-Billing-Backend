import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { encrypt } from '../utils/auth';

import { keys } from '../keys';

export const signIn = async (req: Request, res: Response) => {
    try {
        // Authentication successful
        res.status(200).json({ success: true });
        return;
    } catch (error) {
        res.status(500).json({ success: false, error: error });
        return;
    }
};


export const signUp = async (req: Request, res: Response) => {
    try {
        const { email, name } = req.body;

        const customer = await keys.customers.create({
            email,
            name,
        });

        res.status(200).json({
            success: true,
            customer: customer,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

export const generateToken = async (req: Request, res: Response) => {
    try {
        const { id, email } = req.body;

        const jwtPayload = { id: id, email: email, expiresAt: new Date() }

        const jwt = await encrypt(jwtPayload);
        // Authentication successful
        res.status(200).json({ success: true, token: jwt });
        return;
    } catch (error) {
        res.status(500).json({ success: false, error: error });
        return;
    }
}
