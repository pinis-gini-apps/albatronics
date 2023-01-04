import { Request, Response } from 'express';

export const getByTypes = async (req: Request, res: Response) => {
    const { types } = req.params;
    try {
    } catch (err: any) {
        res.status(400).json({ message: err?.message });
    }
};