import { ErrorRequestHandler } from 'express';
import { CustomAPIError } from '../error/customAPIError';
import { SOMETHING_WENT_WRONG } from '../constants';
import { StatusCodes } from 'http-status-codes';
const errorHandler:ErrorRequestHandler = (error,req,res, next)=>{
    if(error instanceof CustomAPIError){
        return res.status(error.statusCode).json({ msg:error.message });
    }
    return res.status(StatusCodes.NOT_IMPLEMENTED).json({ msg: SOMETHING_WENT_WRONG });
};

export default errorHandler;
