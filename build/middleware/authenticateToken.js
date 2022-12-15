"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null)
        res.status(401).json({ error: 'Null token' });
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET || '', (err, user) => {
            if (err)
                return res.status(401).json({ error: err.message });
            req.user = user;
            next();
        });
    }
};
exports.default = authenticateToken;
