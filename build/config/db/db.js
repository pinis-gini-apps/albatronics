'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const path_1 = __importDefault(require('path'));
const sqlite3_1 = __importDefault(require('sqlite3'));
const sqlite3 = sqlite3_1.default.verbose();
console.log(__dirname, 'identifier.sqlite');
// open the database
const db = new sqlite3.Database(path_1.default.resolve(__dirname, 'identifier.sqlite'), sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        throw Error(err.message);
    }
    console.log('Connected to the identifier database.');
});
exports.default = db;
