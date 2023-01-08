import { Request, Response } from 'express';
import { getByTypesIds } from './../../helpers/queries.helper';

export const getByType = async (req: Request, res: Response) => {
    const { typesIds } = req.body;
    if (!Array.isArray(typesIds)) return res.status(400).json({ message: 'Array expected' });
    if (!typesIds) return res.status(400).json({ message: 'Ids not provided' });
    
    const inRange= (currentValue: number) => (currentValue < 35 && currentValue >= 0);
    
    if (!typesIds.every(inRange)) return res.status(400).json({ message: 'Wrong id passed.' });

    try {
        getByTypesIds('configuration', typesIds)
        .then((data)=> {
            return res.status(200).send(data) ;      
        }).catch((err) => {
            return res.status(400).json({ message: err?.message });
        });
    } catch (err: any) {
        return res.status(400).json({ message: err?.message });
    }
};