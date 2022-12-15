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
exports.getSystemStatus = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
const node_os_1 = __importDefault(require("node:os"));
const getSystemStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paramsArr = [
            ['Model number'],
            ['Serial number'],
            ['Host name'],
            ['Description']
        ];
        const query = 'SELECT DISTINCT * FROM configuration WHERE name = ?';
        const promises = paramsArr.map((p) => {
            return new Promise((resolve) => {
                db_1.default.get(query, p, (err, row) => {
                    resolve({ key: row.name, value: row.value });
                });
            });
        });
        Promise.all(promises).then((values) => {
            let ut_sec = node_os_1.default.uptime();
            let ut_min = ut_sec / 60;
            let ut_hour = ut_min / 60;
            ut_sec = Math.floor(ut_sec);
            ut_min = Math.floor(ut_min);
            ut_hour = Math.floor(ut_hour);
            ut_hour = ut_hour % 60;
            ut_min = ut_min % 60;
            ut_sec = ut_sec % 60;
            return res.status(200).send([
                { key: 'Status', value: 'ok' },
                ...values,
                { key: 'System uptime', value: `${ut_hour} Hour(s) ${ut_min} minute(s) and ${ut_sec} second(s)` },
                { key: 'Total System Uptime', value: 'TODO(Total System Uptime)' }
            ]);
        });
    }
    catch (err) {
        res.status(400).json({ status: 'Error', errorDescription: err === null || err === void 0 ? void 0 : err.message });
    }
});
exports.getSystemStatus = getSystemStatus;
