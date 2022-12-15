import database from '../config/db/db';

// tableName - the table name
// namesArray - names of properties required
// coloumnName - in which column to look
// fildes - which fildes to take into the key value pairs object array

export const getRowsByColumnName = async (tableName: string, namesArray: string[][], columnName: string, fildes: {key: string, value: string}) => {
    const query = `SELECT DISTINCT * FROM ${tableName} WHERE ${columnName} = ?`;

    const promises = namesArray.map((p) => {
        return new Promise((resolve, reject) => {
            database.get(query, p, (err, row) => {    
                if(err) reject(err);            
                resolve({ key: row?.[fildes.key], value: row?.[fildes.value] });
            });
        });
    });

    return Promise.all(promises).then((values) => {
        return values;
    }).catch((err) => {
        return err;
    });
    
};


export const getByTypeId = async (tableName: string, typeId: number | '*') => {
    const query = `SELECT * FROM ${tableName} WHERE type_id = ?`;

    return new Promise((resolve, reject) => {
        database.all(query, typeId, (err, rows) => {   
            if(err) reject(err);          
            resolve(rows);
        });
    }).then((rows: any) => {    
        const keyValueRows = rows.map((row: any) => ({ key: row?.name, value: row?.value }));    
        return keyValueRows;
       });

};

export const getAllRows = async (tableName: string) => {
    const query = `SELECT * FROM ${tableName}`;

    return new Promise((resolve, reject) => {
        database.all(query, [], (err, rows) => {   
            if(err) reject(err);          
            resolve(rows);
        });
    }).then((rows: any) => {            
        return rows;
       });

};
