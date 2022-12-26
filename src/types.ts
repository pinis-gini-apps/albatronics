import jwt from 'jsonwebtoken';
import { Request } from 'express';
export interface IDecodedToken extends jwt.JwtPayload {
    user_id: string;
    userRole: string;
}

export interface IRequest extends Request {
    user: any;
}

export interface JwtPayload {
    user_id: string
  }

export interface IUserRequest {
    user_id: string;
    userRole: string;
}

export interface IChildrenConfig {
    title: string;
    id: string;
    checked: boolean;
}
export interface IConfig {
    id: string;
    title: string;
    childrens: IChildrenConfig[];
}