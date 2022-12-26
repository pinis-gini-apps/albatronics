import jwt from 'jsonwebtoken';

export const jwtTokens = ({ user_id, userRole, username }: {user_id: string, userRole: string, username: string}) => {
    const userData = { user_id, userRole, username };
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '5m' });
    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET || '', { expiresIn: '30m' });
    return ({ accessToken, refreshToken });
};