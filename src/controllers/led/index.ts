import { Request, Response } from 'express';
import db from '../../config/db/db';

export const getLedInfo = async (req: Request, res: Response) => {
    await db.get('SELECT result FROM bit WHERE name = ?', ['LEDstatus'], (err, rows) => {
        if (err) return res.status(400).json({ message: err.message });
        let results = rows.result;
        if (results.length < 4) return res.status(400).json({ message: `Led parameter mast contain exactly 4 values, Found ${results.size} values` });
        results = results.split(',');
        const ledInfoResponse = {
            powerLed: +results[0].trim(),
            accessLed: +results[1].trim(),
            stripLed: +results[2].trim() || +results[3].trim(),
        };
        return res.status(200).send(ledInfoResponse);
    });
};
