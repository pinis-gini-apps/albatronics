"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customAPIError_1 = require("../error/customAPIError");
const constants_1 = require("../constants");
const http_status_codes_1 = require("http-status-codes");
const errorHandler = (error, req, res, next) => {
    if (error instanceof customAPIError_1.CustomAPIError) {
        return res.status(error.statusCode).json({ msg: error.message });
    }
    return res.status(http_status_codes_1.StatusCodes.NOT_IMPLEMENTED).json({ msg: constants_1.SOMETHING_WENT_WRONG });
};
exports.default = errorHandler;
