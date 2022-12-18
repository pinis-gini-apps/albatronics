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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getENodeBInfo = void 0;
const queries_helper_1 = require("../../helpers/queries.helper");
const getENodeBInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const namesArray = [
            ['ENBstatus'],
            ['Tx_EARFCN'],
            ['Tx_BW'],
        ];
        const values = (0, queries_helper_1.getRowsByColumnName)('bit', namesArray, 'name', { key: 'name', value: 'result' });
        values.then((data) => {
            const x = {
                status: data[0].value,
                frequency: data[1].value,
                label: 'MHz'
            };
            return res.status(200).send(x);
        });
    }
    catch (err) {
        res.status(400).json({ status: 'Error', errorDescription: err === null || err === void 0 ? void 0 : err.message });
    }
});
exports.getENodeBInfo = getENodeBInfo;
