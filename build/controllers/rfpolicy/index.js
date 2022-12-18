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
exports.blockRFpolicy = exports.allowRFpolicy = exports.getRFpolicy = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
const getRFpolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.get('SELECT * FROM events ORDER BY date_time DESC LIMIT 1', [], (err, row) => {
            if (err)
                return res.status(400).json({ message: err.message });
            return res.status(200).send({ value: row === null || row === void 0 ? void 0 : row.additional_info });
        });
    }
    catch (error) {
        res.status(400).json({ status: 'Error', errorDescription: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.getRFpolicy = getRFpolicy;
const allowRFpolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = 'UPDATE events SET additional_info = ? WHERE id=(SELECT id FROM events WHERE date_time=(SELECT MAX(date_time) FROM events))';
        yield db_1.default.run(sql, ['allowed'], (err) => {
            if (err)
                return res.status(400).json({ message: err.message });
            return res.sendStatus(200);
        });
    }
    catch (error) {
        res.status(400).json({ status: 'Error', errorDescription: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.allowRFpolicy = allowRFpolicy;
const blockRFpolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = 'UPDATE events SET additional_info = ? WHERE id=(SELECT id FROM events WHERE date_time=(SELECT MAX(date_time) FROM events))';
        yield db_1.default.run(sql, ['blocked'], (err) => {
            if (err)
                return res.status(400).json({ message: err.message });
            return res.sendStatus(200);
        });
    }
    catch (error) {
        res.status(400).json({ status: 'Error', errorDescription: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.blockRFpolicy = blockRFpolicy;
