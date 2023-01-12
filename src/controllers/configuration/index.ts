import { isValidDataType } from './helpers/index';
import database from '../../config/db/db';
import { Request, Response } from 'express';
import { getAllRows, getByColumn } from './../../helpers/queries.helper';
import { allSelectionValidation } from '../system/helpers';
import { IConfigTableRow, IRequest } from '../../types';
import { SOMETHING_WENT_WRONG } from '../../constants';
import { v4 as uuid } from 'uuid';
import { getOsUpTime } from '../../helpers/timeFormatters.helper';
import { isValidTypeId } from './helpers';

export const getByType = async (req: Request, res: Response) => {
    let { ids } = req.query;
    ids = ids as string;

    if (!ids) return res.status(400).json({ message: 'Ids not provided' });
    const typesIds = Array.from(ids)
        .filter((t) => t !== ',')
        .map((t) => +t);

    if (!isValidTypeId(typesIds))
        return res.status(400).json({ message: 'Wrong id passed.' });

    const isOnlyEightType = typesIds.length === 1 && typesIds[0] === 8;

    try {
        getByColumn('configuration', typesIds, 'type_id')
            .then((data) => {
                const keyValueRows = data.map((row: any) => ({
                    key: row?.name,
                    value: row?.value,
                }));
                const rows = isOnlyEightType
                    ? [
                        { key: 'Status', value: 'ok' },
                        ...keyValueRows,
                        { key: 'System uptime', value: getOsUpTime() },
                        { key: 'Total System Uptime', value: 'NA' },
                    ]
                    : keyValueRows;
                return res.status(200).send(rows);
            })
            .catch((err) => {
                return res.status(400).json({ message: err?.message });
            });
    } catch (err: any) {
        return res.status(400).json({ message: err?.message });
    }
};

export const getByName = async (req: Request, res: Response) => {
    let { names } = req.query;
    names = names as string;
    if (!names) return res.status(400).json({ message: 'Names not provided' });
    const typesNames = names.split(',').map((n) => n.trim());

    try {
        getByColumn('configuration', typesNames, 'name')
            .then((data) => {
                const keyValueRows = data.map((row: any) => ({
                    key: row?.name,
                    value: row?.value,
                }));
                return res.status(200).send(keyValueRows);
            })
            .catch((err) => {
                return res.status(400).json({ message: err?.message });
            });
    } catch (err: any) {
        return res.status(400).json({ message: err?.message });
    }
};

export const getByDataType = async (req: Request, res: Response) => {
    let { ids } = req.query;
    ids = ids as string;

    if (!ids) return res.status(400).json({ message: 'Ids not provided' });
    const dataTypes = Array.from(ids)
        .filter((t) => t !== ',')
        .map((t) => +t);

    if (!isValidDataType(dataTypes))
        return res.status(400).json({ message: 'Wrong id passed.' });

    try {
        getByColumn('configuration', dataTypes, 'data_type')
            .then((data) => {
                const keyValueRows = data.map((row: any) => ({
                    key: row?.name,
                    value: row?.value,
                }));
                return res.status(200).send(keyValueRows);
            })
            .catch((err) => {
                return res.status(400).json({ message: err?.message });
            });
    } catch (err: any) {
        return res.status(400).json({ message: err?.message });
    }
};

export const getAllSelection = async (req: Request, res: Response) => {
    const data = getAllRows('configuration');
    data
        .then((rows) => {
            const formattedRows = rows.map((row: any) => {
                const newRow = {
                    ...row,
                    changeStatus: row.change_status,
                    restWarm: row.rest_warm,
                    modifiedTime: row.modified_time,
                    defaultVal: row.default_val,
                    dataType: row.data_type,
                    typeId: row.type_id,
                };

                delete newRow.change_status;
                delete newRow.rest_warm;
                delete newRow.modified_time;
                delete newRow.default_val;
                delete newRow.data_type;
                delete newRow.type_id;

                return newRow;
            });

            return res.status(200).send(formattedRows);
        })
        .catch((err) => {
            res.status(400).json({ message: err?.message });
        });
};

//post
export const addRow = async (expressRequest: Request, res: Response) => {
    const req = expressRequest as IRequest;
    const rows = req.body as IConfigTableRow[];

    if (!rows || rows.length === 0)
        return res.status(400).json({ message: 'No rows' });

    const query = `INSERT INTO configuration (id, name, value, data_type, type_id, change_status, visible, tooltip, rest_warm, default_val, modified_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const promises = rows.map((row: IConfigTableRow) => {
        const id = uuid();
        const {
            name,
            value,
            dataType,
            typeId,
            changeStatus,
            visible,
            tooltip,
            restWarm,
            defaultVal,
            modifiedTime,
        } = row;
        const data = [
            id,
            name,
            value,
            dataType,
            typeId,
            changeStatus,
            visible,
            tooltip,
            restWarm,
            defaultVal,
            modifiedTime,
        ];

        return new Promise(async (resolve, reject) => {
            if (!isValidDataType([+dataType]) || !isValidTypeId([+typeId]))
                return reject({ status: 0, message: 'Can not add row. Invalid type.' });

            if (
                +dataType === 0 &&
                req.user.userRole &&
                req.user.userRole !== 'ADMIN_ROLE'
            ) {
                return reject({
                    status: 0,
                    message: 'Only developer can add data type 0',
                });
            }

            const isValid = await allSelectionValidation(+dataType, value);
            if (!isValid)
                return reject({
                    status: 0,
                    message: `Invalid credentials. The following value: ${value}, can not be assign to data type ${dataType}.`,
                });

            database.run(query, data, (err) => {
                if (err) return reject({ status: 0, message: err?.message });
                resolve({ status: 1, message: 'OK' });
            });
        });
    });

    return Promise.all(promises)
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((status) => {
            return res.status(400).json({ message: status.message });
        });
};

//put
export const editRow = async (expressRequest: Request, res: Response) => {
    const req = expressRequest as IRequest;
    const rows = req.body as IConfigTableRow[];

    if (!rows || rows.length === 0)
        return res.status(400).json({ message: 'No rows' });

    const promises = rows.map(async (row: IConfigTableRow) => {
        const {
            id,
            name,
            value,
            dataType,
            typeId,
            changeStatus,
            visible,
            tooltip,
            restWarm,
            defaultVal,
            modifiedTime,
        } = row;
        const data = [
            name,
            value,
            dataType,
            typeId,
            changeStatus,
            visible,
            tooltip,
            restWarm,
            defaultVal,
            modifiedTime,
            id,
        ];
        return new Promise(async (resolve, reject) => {
            if (!isValidDataType([+dataType]) || !isValidTypeId([+typeId]))
                return reject({ message: 'Can not edit row, invalid type.' });

            const prevDataType = new Promise((resolve, reject) => {
                database.get(
                    'SELECT data_type FROM configuration WHERE id = ?',
                    [id],
                    (err, row) => {
                        if (err || Object.keys(row).length === 0)
                            reject(SOMETHING_WENT_WRONG);
                            resolve(row.data_type);
                    }
                );
            });

            const validPrevDataType = await prevDataType
                .then((type: any) => {
                    if (
                        +type === 0 &&
                        req.user.userRole &&
                        req.user.userRole !== 'ADMIN_ROLE'
                    ) {
                        return {
                            error: true,
                            message: 'Only developer can edit this cell.',
                        };
                    }
                    return { error: false };
                })
                .catch(() => {
                    return { error: true, message: SOMETHING_WENT_WRONG };
                });

            if (validPrevDataType.error)
                return reject({ message: validPrevDataType.message });
            const isValid = await allSelectionValidation(+dataType, value);
            if (!isValid) reject({ message: 'Can not edit row, invalid value' });

            const query = `UPDATE configuration 
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
                            WHERE id = ?`;

            database.run(query, data, (err) => {
                if (err) return reject({ status: 0, message: err?.message });
                resolve({ status: 1, message: 'OK' });
            });
        });
    });
    
    return Promise.all(promises)
        .then(() => {            
            return res.sendStatus(200);
        })
        .catch((status) => {
            return res.status(400).json({ message: status.message });
        });

};

// delete
export const deleteRow = async (req: Request, res: Response) => {
    const { rows } = req.body;
    console.log(req.body);
    
    if (!rows || rows.length === 0) return res.status(400).json({ message: 'No rows' });

    const promises = rows.map(async (rowId: string) => {
        return new Promise(async (resolve, reject) => {
                database.run(
            'DELETE FROM configuration WHERE id = ?',
            [rowId],
            function (err) {
                if (err) return reject({ status: 0, message: err?.message });
                if (!this.changes) return reject({ status: 0, message: 'There is no record with this id' });
                return resolve({ status: 1, message: 'OK' });
            }
        );
        });

    });

    return Promise.all(promises)
        .then(() => {            
            return res.sendStatus(200);
        })
        .catch((status) => {
            return res.status(400).json({ message: status.message });
        });
};
