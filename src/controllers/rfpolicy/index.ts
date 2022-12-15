import { Request, Response } from 'express';
import database from '../../config/db/db';

export const getRFpolicy = async (req: Request, res: Response) => {
    try {
        await database.get('select * from events', [] , (err, row) => {
            if (err) return res.status(400).json({ message: err.message });
            if (Object.keys(row).length > 0) {
                return res.status(200).send({ value: row?.additional_info });
            }
        });
    } catch (error: any) {
        res.status(400).json({ status: 'Error', errorDescription: error?.message });
    }
};