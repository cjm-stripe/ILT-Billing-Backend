import { Request, Response } from 'express';


export const signIn = async (req: Request, res: Response) => {
    try {
        // Check credential is okay
        res.status(200).json("Welcome");
        return;
    } catch (error) {
        res.status(500).json({ success: false, error: error });
        return;
    }
};