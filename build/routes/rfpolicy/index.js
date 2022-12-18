"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rfpolicy_1 = require("../../controllers/rfpolicy");
const router = express_1.default.Router();
//get
router.get('/', rfpolicy_1.getRFpolicy);
router.put('/blocked', rfpolicy_1.blockRFpolicy);
router.put('/allowed', rfpolicy_1.allowRFpolicy);
exports.default = router;
