import jwt from 'jsonwebtoken';

export const jwtTokens = ({ user_id, userRole }: {user_id: string, userRole: string}) => {
    const userData = { user_id, userRole };
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '20s' });
    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET || '', { expiresIn: '5m' });
    return ({ accessToken, refreshToken });
};