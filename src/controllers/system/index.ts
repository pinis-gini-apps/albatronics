import { Request, Response } from 'express';
import {
  getAllRows,
  getByTypeId,
  getRowsByColumnName,
} from '../../helpers/queries.helper';
import { getOsUpTime } from '../../helpers/timeFormatters.helper';
import database from '../../config/db/db';

// get

export const getSystemStatus = async (req: Request, res: Response) => {
  try {
    const namesArray = [
      ['Model number'],
      ['Serial'],
      ['Hostname'],
      ['Description'],
    ];
    const values = getRowsByColumnName('configuration', namesArray, 'name', {
      key: 'name',
      value: 'value',
    });

    values.then((data) => {
      return res
        .status(200)
        .send([
          { key: 'Status', value: 'ok' },
          ...data,
          { key: 'System uptime', value: getOsUpTime() },
          { key: 'Total System Uptime', value: 'TODO(Total System Uptime)' },
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
  const data = [
    {
      key: 'Connected Users',
      value: '23',
    },
    {
      key: 'Idle users',
      value: '4',
    },
    {
      key: 'Total DL Throughput [Mbps]',
      value: '15.6',
    },
    {
      key: 'Total DL Rbs (Max. RBs)',
      value: '42 (50)',
    },
    {
      key: 'Total UL Throughput [Mbps]',
      value: '3.5',
    },
    {
      key: 'Total DL Rbs (Max. RBs)',
      value: '12 (50)',
    },
  ];

  return res.status(200).send(data);
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
      }));
      return res.status(200).send(formattedRows);
    })
    .catch((err) => {
      res.status(400).json({ status: 'Error', errorDescription: err?.message });
    });
};

export const getSoftwareVersion = async (req: Request, res: Response) => {
  try {
    const namesArray = [
      ['SW_Build'],
      ['FPGA_VER'],
      ['PMC_VER'],
      ['L1_VER'],
      ['PS_VER'],
      ['TS_VER'],
      ['GUI_VER'],
      ['NIB_VER'],
      ['EMS_VER'],
      ['MME_VER'],
      ['SGW_VER'],
      ['PGW_VER'],
      ['HSS_VER'],
    ];

    const values = getRowsByColumnName('configuration', namesArray, 'name', {
      key: 'name',
      value: 'value',
    });

    values.then((data) => {
      return res.status(200).send([...data]);
    });
  } catch (err: any) {
    res.status(400).json({ status: 'Error', errorDescription: err?.message });
  }
};

// delete
export const deleteRow = async (req: Request, res: Response) => {
  database.run(
    'DELETE FROM configuration WHERE id = ? ',
    [req.params.id],
    (err) => {
      if (err) return res.status(400).json({ status: 'Error', errorDescription: err?.message });
      return res.sendStatus(200);
    }
  );
};
