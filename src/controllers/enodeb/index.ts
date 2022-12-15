import { Request, Response } from 'express';
import { getRowsByColumnName } from '../../helpers/queries.helper';

export const getENodeBInfo = async (req: Request, res: Response) => {
    try {

        const namesArray = [
            ['ENBstatus'],
            ['Tx_EARFCN'],
            ['Tx_BW'],
        ];
        const values = getRowsByColumnName('bit', namesArray, 'name', { key: 'name', value: 'result' });

        values.then((data: any[]) => {
            console.log(data);
            
            const x = {
                status: data[0].value,
                frequency: data[1].value,
                label: 'MHz'
            };
            console.log(x);
            
            return res.status(200).send(x);
        });
    } catch (err: any) {
        res.status(400).json({ status: 'Error', errorDescription: err?.message });
    }
};