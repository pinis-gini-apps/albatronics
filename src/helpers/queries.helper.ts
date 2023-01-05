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

export const getByTypesIds = async (tableName: string, typesIds: number[]) => {
    const query = `SELECT * FROM ${tableName} WHERE type_id = ?`;    

    const promises = typesIds.map((id) => {
        return new Promise((resolve, reject) => {
            database.all(query, id, (err, row: any) => {    
                if(err) reject(err);
                resolve(row);
            });
        });
    });

    return Promise.all(promises)
    .then((values) => {
        const formattedRows = values.flat().map((row: any) => {
            const newRow = { ...row,
            changeStatus: row.change_status,
            restWarm: row.rest_warm,
            modifiedTime: row.modified_time,
            defaultval: row.default_val,
            dataType: row.data_type,
            typeId: row.type_id
          };
          
          delete newRow.change_status;
          delete newRow.rest_warm;
          delete newRow.modified_time;
          delete newRow.default_val;
          delete newRow.data_type;
          delete newRow.type_id;
    
          return newRow;
        });

        return formattedRows;
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


export const getUserConfig = async(userRole: string) => {   
    
    const getRoutes = new Promise ((resolve, reject) => {
        database.all('select * from routes',[], (err, rows) => {
            if (err) reject([]);
            if (rows.length > 0) resolve(rows);
        });
    });

    const promises = (rows: any) => rows.map((r:any) => {
        return new Promise((resolve) => {
            database.all(`SELECT name FROM sub_routes WHERE route_id = ? and ${userRole.toLowerCase()}=1`, 
            [r.route_id],
             (err, rows) => {                                        
                if (!err || (rows && rows.length !== 0)) {
                    resolve({ route: r.name, sub_routes: rows });
                }                        
            });
        });
    });
    
     return getRoutes
        .then((res: any) => {                  
            return Promise.all(promises(res));
         })
         .then(((promise) => {                                
            return promise;
         }))
         .catch(() => {
             return false;
         });
};