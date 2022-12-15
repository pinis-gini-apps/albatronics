"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080'];
exports.corsOptions = {
    origin: allowedOrigins
};
