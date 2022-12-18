"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRows = exports.getByTypeId = exports.getRowsByColumnName = void 0;
const db_1 = __importDefault(require("../config/db/db"));
// tableName - the table name
// namesArray - names of properties required
// coloumnName - in which column to look
// fildes - which fildes to take into the key value pairs object array
const getRowsByColumnName = (tableName, namesArray, columnName, fildes) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT DISTINCT * FROM ${tableName} WHERE ${columnName} = ?`;
    const promises = namesArray.map((p) => {
        return new Promise((resolve, reject) => {
            db_1.default.get(query, p, (err, row) => {
                if (err)
                    reject(err);
                resolve({ key: row === null || row === void 0 ? void 0 : row[fildes.key], value: row === null || row === void 0 ? void 0 : row[fildes.value] });
            });
        });
    });
    return Promise.all(promises).then((values) => {
        return values;
    }).catch((err) => {
        return err;
    });
});
exports.getRowsByColumnName = getRowsByColumnName;
const getByTypeId = (tableName, typeId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM ${tableName} WHERE type_id = ?`;
    return new Promise((resolve, reject) => {
        db_1.default.all(query, typeId, (err, rows) => {
            if (err)
                reject(err);
            resolve(rows);
        });
    }).then((rows) => {
        const keyValueRows = rows.map((row) => ({ key: row === null || row === void 0 ? void 0 : row.name, value: row === null || row === void 0 ? void 0 : row.value }));
        return keyValueRows;
    });
});
exports.getByTypeId = getByTypeId;
const getAllRows = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM ${tableName}`;
    return new Promise((resolve, reject) => {
        db_1.default.all(query, [], (err, rows) => {
            if (err)
                reject(err);
            resolve(rows);
        });
    }).then((rows) => {
        return rows;
    });
});
exports.getAllRows = getAllRows;
