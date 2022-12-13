import jwt from 'jsonwebtoken';

export interface IDecodedToken extends jwt.JwtPayload {
    user_id: string;
    userRole: string;
}