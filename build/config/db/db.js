"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite3 = sqlite3_1.default.verbose();
// open the database
const path = process.env.NODE_ENV === 'production' ? '' : '/Users/roeis/Desktop/node-backend/src/config/db/identifier.sqlite';
console.log(process.env.NODE_ENV);
const db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        throw Error(err.message);
    }
    console.log('Connected to the identifier database.');
});
exports.default = db;
