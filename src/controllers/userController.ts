import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import database from '../db/db';
import bcrypt from "bcrypt";

export const resetPassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) res.status(400).json({ message: 'Missing new or old password' });

    try {
        // @ts-ignore
        await database.all('SELECT password, id FROM users WHERE id = ?' , [req.user.user_id], async (err, row) => {
        if (err) res.status(400).json({ message: 'User not found' });
        if(row.length > 0) {
            const user = row[0];
            console.log(user, user.password, oldPassword)
            const isMatched = await bcrypt.compare(oldPassword, user.password);
            if (isMatched) {
                const newHashedPassword = await bcrypt.hash(newPassword, 10);
                await database.run('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, user.id], (err) => {
                    if(err) res.status(400).json({ message: 'Not able to change password.' });
                    res.status(200).json({ message: 'Password changed.' });
                })
            } else {
                res.status(400).json({ message: 'Not matched passwords.' });
            }
        }
    })
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const resetAnotherPassword = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) res.status(401).json({ error: 'Null token' });
    if (token) {
        const decode = jwt.decode(token);
        console.log(decode)
    } else {
        console.log('sadasd')
    }
}