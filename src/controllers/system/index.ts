import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import {
  getAllRows,
  getByTypeId,
} from '../../helpers/queries.helper';
import { getOsUpTime } from '../../helpers/timeFormatters.helper';
import database from '../../config/db/db';
import { allSelectionValidation } from './helpers';
import { IRequest } from '../../types';

// get

export const getSystemStatus = async (req: Request, res: Response) => {
  try {
    const values = getByTypeId('configuration', 8);
    values.then((data) => {
      return res
        .status(200)
        .send([
          { key: 'Status', value: 'ok' },
          ...data,
          { key: 'System uptime', value: getOsUpTime() },
          { key: 'Total System Uptime', value: 'NA' },
        ]);

    });
  } catch (err: any) {
    res.status(400).json({ status: 'Error', errorDescription: err?.message });
  }
};

export const getCellularInfo = async (req: Request, res: Response) => {
  const data = getByTypeId('configuration', 1);
  data
    .then((rows) => {
      return res.status(200).send(rows);
    })
    .catch((err) => {
      res.status(400).json({ status: 'Error', errorDescription: err?.message });
    });
};

export const getPerformanceInfo = async (req: Request, res: Response) => {

  database.all('SELECT name, value FROM kpi', [], (err, rows) => {
    if (err) return res.status(400).json({ status: 'Error', errorDescription: err?.message });
    if (rows.length > 0) {
      const kpiRows = rows.map((row) => {
        delete Object.assign(row, { ['key']: row['name'] })['name'];
        row.value = row.value === -1 ? 'NA' : row.value;
        return row;
      });
      return res.status(200).send(kpiRows);

    } else {
      return res.status(400).json({ status: 'Error', errorDescription: 'No values' });
    }
  });
};

export const getEpcLicense = async (req: Request, res: Response) => {
  const data = getByTypeId('configuration', 7);

  data
    .then((rows) => {
      return res.status(200).send(rows);
    })
    .catch((err) => {
      res.status(400).json({ status: 'Error', errorDescription: err?.message });
    });
};

export const getAllSelection = async (req: Request, res: Response) => {
  const data = getAllRows('configuration');
  data
    .then((rows) => {
      const formattedRows = rows.map((row: any) => ({
        ...row,
        changeStatus: row.change_status,
        restWarm: row.rest_warm,
        modifiedTime: row.modified_time,
        defaultval: row.default_val,
        dataType: row.data_type,
        typeId: row.type_id
      }));
      return res.status(200).send(formattedRows);
    })
    .catch((err) => {
      res.status(400).json({ status: 'Error', errorDescription: err?.message });
    });
};

export const getSoftwareVersion = async (req: Request, res: Response) => {
  try {
    const values = getByTypeId('configuration', 2);
    values.then((data) => {
      return res.status(200).send([...data]);
    });
  } catch (err: any) {
    res.status(400).json({ status: 'Error', errorDescription: err?.message });
  }
};

// delete
export const deleteRow = async (req: Request, res: Response) => {
  try {
    database.run(
      'DELETE FROM configuration WHERE id = ? ',
      [req.params.id],
      (err) => {
        if (err) return res.status(400).json({ status: 'Error', errorDescription: err?.message });
        return res.sendStatus(200);
      }
    );
  } catch (error) {
    if (error) return res.status(400).json({ message: 'Something went wrong' });
  }

};


//post
export const addRow = async (expressRequest: Request, res: Response) => {
  const req = expressRequest as IRequest;
  const { name, value, dataType, typeId, changeStatus, visible, tooltip, restWarm, defaultVal, modifiedTime } = req.body;

  try {
    if ((+dataType) === 0 && req.user.userRole && req.user.userRole !== 'ADMIN_ROLE') {
      return res.status(400).json({ message: 'Only developer can add data type 0' });
    }

    const isValid = await allSelectionValidation((+dataType), value);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    const id = uuid();

    database.run(
      `INSERT INTO configuration (id, name, value, data_type, type_id, change_status, visible, tooltip, rest_warm, default_val, modified_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, value, dataType, typeId, changeStatus, visible, tooltip, restWarm, defaultVal, modifiedTime],
      (err) => {
        if (err) return res.status(400).json({ status: 'Error', errorDescription: err?.message });
        return res.sendStatus(200);
      }
    );
  } catch (error) {
    if (error) return res.status(400).json({ message: 'Something went wrong' });
  }

};

//put
export const editRow = async (expressRequest: Request, res: Response) => {
  const req = expressRequest as IRequest;
  const { id, name, value, dataType, typeId, changeStatus, visible, tooltip, restWarm, defaultVal, modifiedTime } = req.body;
  try {
    const prevDataType = new Promise(( resolve, reject ) => {
      database.get('SELECT data_type FROM configuration WHERE id = ?', [id], (err, row) => {        
        if(err || Object.keys(row).length === 0 || !!row.data_type) reject('Something went wrong');
        resolve(row.data_type);
      });
    });

    const validPrevDataType = await prevDataType
    .then((type: any) => {      
      if ((+type) === 0 && req.user.userRole && req.user.userRole !== 'ADMIN_ROLE') {
        return { error: true, message: 'Only developer can edit this cell.' };
      }
      return { error: false };
    })
    .catch(() => {      
      return { error: true, message: 'Something went wrong' };
    });
    
    if (validPrevDataType.error) return res.status(400).json({ message: validPrevDataType.message });

    const isValid = await allSelectionValidation((+dataType), value);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    database.run(
      `UPDATE configuration 
    SET name = ?, 
    value = ?, 
    data_type = ?, 
    type_id = ?, 
    change_status = ?,
    visible = ?, 
    tooltip = ?, 
    rest_warm = ?, 
    default_val = ?, 
    modified_time = ?
    WHERE id = ?`,
      [name, value, dataType, typeId, changeStatus, visible, tooltip, restWarm, defaultVal, modifiedTime, id],
      (err) => {
        if (err) return res.status(400).json({ status: 'Error', errorDescription: err?.message });
        return res.sendStatus(200);
      }
    );
  } catch (error) {
    if (error) return res.status(400).json({ message: 'Something went wrong' });
  }
};
