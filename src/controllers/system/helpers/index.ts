import database from '../../../config/db/db';

export const allSelectionValidation = async (dataType: string, value: string) => {
    if ((+dataType) < 0 || (+dataType) > 23) return false;

    const validate = new Promise((resolve, reject) => {
        database.get('SELECT value FROM data_type WHERE id = ?',
        [dataType],
        (err, row) => {            
            if (err) reject(false);
            if (row.length === 0) reject(false);
            const valueRegex = new RegExp(row.value);
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

