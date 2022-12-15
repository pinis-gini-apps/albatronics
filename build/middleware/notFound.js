"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../constants");
const notFound = (req, res) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send(constants_1.ROUTE_NOT_EXIST);
};
exports.default = notFound;
