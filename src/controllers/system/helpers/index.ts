import database from '../../../config/db/db';

export const allSelectionValidation = async (dataType: number, value: string) => { 
    if (!value) return false;
    const validate = new Promise((resolve, reject) => {
        database.get('SELECT value FROM data_type WHERE id = ?',
        [dataType],
        (err, row) => {            
            if (err) reject(false);
            if (row.length === 0) reject(false);            
            const valueRegex = new RegExp(row.value.slice(1, row.value.length));
            if (valueRegex.test(value)) {         
                resolve(true);
            }else {
                reject(false);
            }
        }
        );
    });

    return await validate.then(() => true).catch(() => false);
};

