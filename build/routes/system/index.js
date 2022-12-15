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
router.get('/all-selection');
router.get('/status/cellular');
//post
router.post('/all-selection');
//put
router.put('/all-selection');
//delete
router.delete('/all-selection/:id');
exports.default = router;
