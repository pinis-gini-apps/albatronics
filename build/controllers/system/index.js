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
exports.editRow = exports.addRow = exports.deleteRow = exports.getSoftwareVersion = exports.getAllSelection = exports.getEpcLicense = exports.getPerformanceInfo = exports.getCellularInfo = exports.getSystemStatus = void 0;
const uuid_1 = require("uuid");
const queries_helper_1 = require("../../helpers/queries.helper");
const timeFormatters_helper_1 = require("../../helpers/timeFormatters.helper");
const db_1 = __importDefault(require("../../config/db/db"));
// get
const getSystemStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const namesArray = [
            ['Model number'],
            ['Serial'],
            ['Hostname'],
            ['Description'],
        ];
        const values = (0, queries_helper_1.getRowsByColumnName)('configuration', namesArray, 'name', {
            key: 'name',
            value: 'value',
        });
        values.then((data) => {
            return res
                .status(200)
                .send([
                { key: 'Status', value: 'ok' },
                ...data,
                { key: 'System uptime', value: (0, timeFormatters_helper_1.getOsUpTime)() },
                { key: 'Total System Uptime', value: 'TODO(Total System Uptime)' },
            ]);
        });
    }
    catch (err) {
        res.status(400).json({ status: 'Error', errorDescription: err === null || err === void 0 ? void 0 : err.message });
    }
});
exports.getSystemStatus = getSystemStatus;
const getCellularInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = (0, queries_helper_1.getByTypeId)('configuration', 1);
    data
        .then((rows) => {
        return res.status(200).send(rows);
    })
        .catch((err) => {
        res.status(400).json({ status: 'Error', errorDescription: err === null || err === void 0 ? void 0 : err.message });
    });
});
exports.getCellularInfo = getCellularInfo;
const getPerformanceInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = [
        {
            key: 'Connected Users',
            value: '23',
        },
        {
            key: 'Idle users',
            value: '4',
        },
        {
            key: 'Total DL Throughput [Mbps]',
            value: '15.6',
        },
        {
            key: 'Total DL Rbs (Max. RBs)',
            value: '42 (50)',
        },
        {
            key: 'Total UL Throughput [Mbps]',
            value: '3.5',
        },
        {
            key: 'Total DL Rbs (Max. RBs)',
            value: '12 (50)',
        },
    ];
    return res.status(200).send(data);
});
exports.getPerformanceInfo = getPerformanceInfo;
const getEpcLicense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = (0, queries_helper_1.getByTypeId)('configuration', 7);
    data
        .then((rows) => {
        return res.status(200).send(rows);
    })
        .catch((err) => {
        res.status(400).json({ status: 'Error', errorDescription: err === null || err === void 0 ? void 0 : err.message });
    });
});
exports.getEpcLicense = getEpcLicense;
const getAllSelection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = (0, queries_helper_1.getAllRows)('configuration');
    data
        .then((rows) => {
        const formattedRows = rows.map((row) => (Object.assign(Object.assign({}, row), { changeStatus: row.change_status, restWarm: row.rest_warm, modifiedTime: row.modified_time, defaultval: row.default_val, dataType: row.data_type })));
        return res.status(200).send(formattedRows);
    })
        .catch((err) => {
        res.status(400).json({ status: 'Error', errorDescription: err === null || err === void 0 ? void 0 : err.message });
    });
});
exports.getAllSelection = getAllSelection;
const getSoftwareVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const namesArray = [
            ['SW_Build'],
            ['FPGA_VER'],
            ['PMC_VER'],
            ['L1_VER'],
            ['PS_VER'],
            ['TS_VER'],
            ['GUI_VER'],
            ['NIB_VER'],
            ['EMS_VER'],
            ['MME_VER'],
            ['SGW_VER'],
            ['PGW_VER'],
            ['HSS_VER'],
        ];
        const values = (0, queries_helper_1.getRowsByColumnName)('configuration', namesArray, 'name', {
            key: 'name',
            value: 'value',
        });
        values.then((data) => {
            return res.status(200).send([...data]);
        });
    }
    catch (err) {
        res.status(400).json({ status: 'Error', errorDescription: err === null || err === void 0 ? void 0 : err.message });
    }
});
exports.getSoftwareVersion = getSoftwareVersion;
// delete
const deleteRow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    db_1.default.run('DELETE FROM configuration WHERE id = ? ', [req.params.id], (err) => {
        if (err)
            return res.status(400).json({ status: 'Error', errorDescription: err === null || err === void 0 ? void 0 : err.message });
        return res.sendStatus(200);
    });
});
exports.deleteRow = deleteRow;
//post 
const addRow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, value, dataType, typeId, changeStatus, visible, tooltip, restWarm, defaultVal, modifiedTime } = req.body;
    const id = (0, uuid_1.v4)();
    db_1.default.run(`INSERT INTO configuration (id, name, value, data_type, type_id, change_status, visible, tooltip, rest_warm, default_val, modified_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [id, name, value, dataType, typeId, changeStatus, visible, tooltip, restWarm, defaultVal, modifiedTime], (err) => {
        if (err)
            return res.status(400).json({ status: 'Error', errorDescription: err === null || err === void 0 ? void 0 : err.message });
        return res.sendStatus(200);
    });
});
exports.addRow = addRow;
//put
const editRow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, value, dataType, typeId, changeStatus, visible, tooltip, restWarm, defaultVal, modifiedTime } = req.body;
    db_1.default.run(`UPDATE configuration 
    SET name = ?, 
    value = ?, 
    data_type = ?, 
    type_id = ?, 
    change_status = ?,
    visible = ?, 
    tooltip = ?, 
    rest_warm = ?, 
    default_val = ?, 
    modified_time = ?
    WHERE id = ?`, [name, value, dataType, typeId, changeStatus, visible, tooltip, restWarm, defaultVal, modifiedTime, id], (err) => {
        if (err)
            return res.status(400).json({ status: 'Error', errorDescription: err === null || err === void 0 ? void 0 : err.message });
        return res.sendStatus(200);
    });
});
exports.editRow = editRow;
