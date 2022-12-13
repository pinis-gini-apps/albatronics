import cors from 'cors';

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080'];

export const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins
};
