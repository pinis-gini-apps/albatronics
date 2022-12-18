"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const system_1 = require("../../controllers/system");
//get
router.get('/status/system', system_1.getSystemStatus);
router.get('/all-selection', system_1.getAllSelection);
router.get('/status/cellular', system_1.getCellularInfo);
router.get('/status/performance', system_1.getPerformanceInfo);
router.get('/general/epc-license', system_1.getEpcLicense);
router.get('/general/software-version', system_1.getSoftwareVersion);
//post
router.post('/all-selection', system_1.addRow);
//put
router.put('/all-selection', system_1.editRow);
//delete
router.delete('/all-selection/:id', system_1.deleteRow);
exports.default = router;
