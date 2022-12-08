import express, { Response, Request } from 'express';
import db from './db/db';
require('dotenv').config();
import cookieParser from "cookie-parser";

import authRouter from './routes/auth';

const app = express();
const PORT = process.env.PORT || 8081;
app.use(express.json());
app.use(cookieParser());


app.get('/', (req: Request, res: Response) => {
    db.all('select * from users', [], (err: any, rows: any) => {
        if (err) console.log(err)
        rows.forEach((row: any) => console.log(row))
    })
})

app.use('/', authRouter);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

