require('dotenv').config();
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface IRequest extends Request {
    user: string | jwt.JwtPayload | undefined;
}

 const authenticateToken = (req: IRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) res.status(401).json({ error: 'Null token' });
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '', (err, user) => {
            if(err) res.status(401).json({ error: err.message });
            req.user = user;
            next();
        });
    }
};

export default authenticateToken;