import express, { Response, Request } from 'express';
import db from './db/db';
require('dotenv').config();
import cookieParser from "cookie-parser";
import database from './db/db'

import authRouter from './routes/auth';
import userRouter from './routes/user';

import authenticateToken from "./middleware/authenticateToken";

const app = express();
const PORT = process.env.PORT || 8081;
const apiPath = '/api/v1/'
app.use(express.json());
app.use(cookieParser());

app.use(`${apiPath}`, authRouter);
app.use(`${apiPath}user/`, authenticateToken as express.RequestHandler, userRouter);

app.get('/', (req, res) => {
    database.all('select * from users', [], (err, rows) => {
        console.log(rows)
    });
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});