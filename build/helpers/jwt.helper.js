"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtTokens = ({ user_id, userRole }) => {
    const userData = { user_id, userRole };
    const accessToken = jsonwebtoken_1.default.sign(userData, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '5m' });
    const refreshToken = jsonwebtoken_1.default.sign(userData, process.env.REFRESH_TOKEN_SECRET || '', { expiresIn: '4h' });
    return ({ accessToken, refreshToken });
};
exports.jwtTokens = jwtTokens;
