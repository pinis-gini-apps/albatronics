import {Request, Response} from "express";
import database from '../../config/database/db';
import os from 'node:os';

export const getSystemStatus = async (req: Request, res: Response) => {
    try {

        const parmasArr = [
            ['Model number'],
            ['Serial number'],
            ['Host name'],
            ['Description']
        ]
        const query = 'SELECT DISTINCT * FROM configuration WHERE name = ?';
        let results = [{ key: 'Status', value: 'ok' }];

        const promises = parmasArr.map(p => {
            return new Promise((resolve) => {
                database.get(query, p, (err, row) => {
                    resolve({ key: row.name, value: row.value })
                })
            })
        })
        Promise.all(promises).then(values => {
            let ut_sec = os.uptime();
            let ut_min = ut_sec/60;
            let ut_hour = ut_min/60;

            ut_sec = Math.floor(ut_sec);
            ut_min = Math.floor(ut_min);
            ut_hour = Math.floor(ut_hour);

            ut_hour = ut_hour%60;
            ut_min = ut_min%60;
            ut_sec = ut_sec%60;



            return res.status(200).send([
                { key: 'Status', value: 'ok' },
                ...values,
                { key: 'System uptime', value: `${ut_hour} Hour(s) ${ut_min} minute(s) and ${ut_sec} second(s)` },
                {key: 'Total System Uptime', value: 'TODO(Total System Uptime)'}
            ] );
        })
    } catch (err: any) {
        res.status(400).json({ status: 'Error', errorDescription: err?.message })
    }
}