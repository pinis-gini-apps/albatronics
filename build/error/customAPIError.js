"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomError = exports.CustomAPIError = void 0;
class CustomAPIError extends Error {
    constructor(message, status) {
        super(message);
        this.statusCode = status;
    }
}
exports.CustomAPIError = CustomAPIError;
const createCustomError = (message, status) => {
    return new CustomAPIError(message, status);
};
exports.createCustomError = createCustomError;
