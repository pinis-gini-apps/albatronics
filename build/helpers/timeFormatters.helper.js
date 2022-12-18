"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOsUpTime = void 0;
const node_os_1 = __importDefault(require("node:os"));
// returns the OS uptime in hx/mx/sx formmat
const getOsUpTime = () => {
    let ut_sec = node_os_1.default.uptime();
    let ut_min = ut_sec / 60;
    let ut_hour = ut_min / 60;
    ut_sec = Math.floor(ut_sec);
    ut_min = Math.floor(ut_min);
    ut_hour = Math.floor(ut_hour);
    ut_hour = ut_hour % 60;
    ut_min = ut_min % 60;
    ut_sec = ut_sec % 60;
    return `${ut_hour} Hour(s) ${ut_min} minute(s) and ${ut_sec} second(s)`;
};
exports.getOsUpTime = getOsUpTime;
