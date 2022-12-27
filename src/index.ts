import express from 'express';
import { config } from 'dotenv';
config();
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

// import middlewares
import authenticateToken from './middleware/authenticateToken';
import notFound from './middleware/notFound';
import errorHandler from './middleware/errorHandler';
import { corsOptions } from './config/config';

// import routes
import authRouter from './routes/auth';
import userRouter from './routes/user';
import systemRouter from './routes/system';
import rfPolicyRouter from './routes/rfpolicy';
import ledRouter from './routes/led';
import enodebRouter from './routes/enodeb';

const app = express();
const PORT = process.env.PORT || 8080;
const apiPath = '/api';

// app middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));


//app routers
app.use('/', authRouter);

// protected routes
app.use(`${apiPath}/system/`, authenticateToken as express.RequestHandler, systemRouter);
app.use(`${apiPath}/user/`, authenticateToken as express.RequestHandler, userRouter);
app.use(`${apiPath}/rfpolicy/`, authenticateToken as express.RequestHandler, rfPolicyRouter);
app.use(`${apiPath}/led/`, authenticateToken as express.RequestHandler, ledRouter);
app.use(`${apiPath}/enodeb/`, authenticateToken as express.RequestHandler, enodebRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
