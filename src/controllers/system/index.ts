import { Request, Response } from 'express';

import database from '../../config/db/db';

export const getPerformanceInfo = async (req: Request, res: Response) => {
  database.all('SELECT name, value FROM kpi', [], (err, rows) => {
    if (err) return res.status(400).json({ message: err?.message });
    if (rows.length > 0) {
      const kpiRows = rows.map((row) => {
        delete Object.assign(row, { ['key']: row['name'] })['name'];
        row.value = row.value === -1 ? 'NA' : row.value;
        return row;
      });
      return res.status(200).send(kpiRows);

    } else {
      return res.status(400).json({ message: 'No values' });
    }
  });
};

