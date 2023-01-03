import { jwtTokens } from '../../helpers/jwt.helper';
import { config } from 'dotenv';
config();
import { Response, Request } from 'express';
import database from '../../config/db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IDecodedToken } from '../../types';
import { getOsTimeAndDate } from '../../helpers/timeFormatters.helper';

export const userLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) res.status(400).json({ message: 'Missing username or password' });

    try {
        await database.all(
            'SELECT login_name, id, password FROM users WHERE login_name = ? '
            , [username]
            , async (error, rows) => {
                if (error) return res.status(400).json({ message: 'Cannot find user.' });
                if (rows.length > 0) {
                    const user = rows[0];                    
                    const isPasswordMatch = await bcrypt.compare(password, user.password);
                    if (isPasswordMatch) {
                        await database.all(
                            'SELECT * FROM users_roles WHERE user_id = ? ',
                            [user.id],
                            (error, row) => {
                                if (error) res.status(400).json({ message: 'Cannot find user role.' });
                                const userData = { user_id: user.id, userRole: row[0].roles_name, username: rows[0].login_name };
                                const tokens = jwtTokens(userData);
                                res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
                                return res.status(200).json({ token: tokens.accessToken });
                            }
                        );
                    } else {
                        return res.status(401).json({ message: 'Wrong password.' });
                    }
                } else {
                    return res.status(400).json({ message: 'Cannot find user.' });
                }
            }
        );
    } catch (error) {
        return res.status(401).json({ message: 'Cannot login' });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (refreshToken === null) return res.status(401).json({ error: 'Null refresh token' });

        const decoded = await <IDecodedToken>jwt.decode(refreshToken);

        const userData = {
            user_id: decoded!.user_id,
            userRole: decoded!.userRole,
            username: decoded!.login_name
        };

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || '', (err: any) => {
            if (err) return res.status(401).json({ error: err.message });
            const tokens = jwtTokens(userData);
            res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
            return res.status(200).json({ token: tokens.accessToken, timestamp: getOsTimeAndDate(new Date()) });
        });

    } catch (error: any) {
        return res.status(401).json({ error: error.message });
    }

};