import { Request, Response } from 'express';
import database from '../../config/db/db';

export const getRFpolicy = async (req: Request, res: Response) => {
    try {
        await database.get('SELECT * FROM events ORDER BY date_time DESC LIMIT 1', [] , (err, row) => {
            if (err) return res.status(400).json({ message: err.message });
            return res.status(200).send({ value: row?.additional_info });
        });
    } catch (error: any) {
        res.status(400).json({ status: 'Error', errorDescription: error?.message });
    }
};

export const allowRFpolicy = async (req: Request, res: Response) => {
    try {
        const sql = 'UPDATE events SET additional_info = ? WHERE id=(SELECT id FROM events WHERE date_time=(SELECT MAX(date_time) FROM events))';
        await database.run(sql, ['allowed'] , (err) => {
            if (err) return res.status(400).json({ message: err.message });
            return res.sendStatus(200);
        });
    } catch (error: any) {
        res.status(400).json({ status: 'Error', errorDescription: error?.message });
    }
};

export const blockRFpolicy = async (req: Request, res: Response) => {
    try {
        const sql = 'UPDATE events SET additional_info = ? WHERE id=(SELECT id FROM events WHERE date_time=(SELECT MAX(date_time) FROM events))';
        await database.run(sql, ['blocked'] , (err) => {
            if (err) return res.status(400).json({ message: err.message });
            return res.sendStatus(200);
        });
    } catch (error: any) {
        res.status(400).json({ status: 'Error', errorDescription: error?.message });
    }
};