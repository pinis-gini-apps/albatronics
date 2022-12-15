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
exports.getLedInfo = void 0;
const db_1 = __importDefault(require("../../config/db/db"));
const getLedInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.get('SELECT result FROM bit WHERE name = ?', ['LEDstatus'], (err, rows) => {
        if (err)
            return res.status(400).json({ message: err.message });
        let results = rows.result;
        if (results.length < 4)
            return res.status(400).json({ message: `Led parameter mast contain exactly 4 values, Found ${results.size} values` });
        results = results.split(',');
        const ledInfoResponse = {
            powerLed: +results[0].trim(),
            accessLed: +results[1].trim(),
            stripLed: +results[2].trim() || +results[3].trim(),
        };
        return res.status(200).send(ledInfoResponse);
    });
});
exports.getLedInfo = getLedInfo;
