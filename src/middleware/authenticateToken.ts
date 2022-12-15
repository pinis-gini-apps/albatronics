import { config } from 'dotenv';
config();
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { IRequest } from '../types';

 const authenticateToken = (req: IRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) res.status(401).json({ error: 'Null token' });
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '', (err, user) => {
            if(err) return res.status(401).json({ error: err.message });
            req.user = user;
            next();
        });
    }
};

export default authenticateToken;