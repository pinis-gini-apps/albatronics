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
exports.refreshToken = exports.userLogin = void 0;
const jwt_helper_1 = require("../../helpers/jwt.helper");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const db_1 = __importDefault(require("../../config/db/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password)
        res.status(400).json({ message: 'Missing username or password' });
    try {
        yield db_1.default.all('SELECT login_name, id, password FROM users WHERE login_name = ? ', [username], (error, rows) => __awaiter(void 0, void 0, void 0, function* () {
            if (error)
                res.status(400).json({ message: 'Cannot find user.' });
            if (rows.length > 0) {
                const user = rows[0];
                const isPasswordMatch = yield bcrypt_1.default.compare(password, rows[0].password);
                if (isPasswordMatch) {
                    yield db_1.default.all('SELECT * FROM users_roles WHERE user_id = ? ', [user.id], (error, row) => {
                        if (error)
                            res.status(400).json({ message: 'Cannot find user role.' });
                        const userData = { user_id: user.id, userRole: row[0].roles_name };
                        const tokens = (0, jwt_helper_1.jwtTokens)(userData);
                        res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
                        res.status(200).json({ token: tokens.accessToken });
                    });
                }
                else {
                    res.status(401).json({ message: 'Wrong password.' });
                }
            }
        }));
    }
    catch (error) {
        res.status(401).json({ message: 'Cannot login' });
    }
});
exports.userLogin = userLogin;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (refreshToken === null)
            return res.status(401).json({ error: 'Null refresh token' });
        const decoded = yield jsonwebtoken_1.default.decode(refreshToken);
        const userData = {
            user_id: decoded.user_id,
            userRole: decoded.userRole
        };
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || '', (err) => {
            if (err)
                res.status(401).json({ error: err.message });
            const tokens = (0, jwt_helper_1.jwtTokens)(userData);
            res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
            res.status(200).json({ token: tokens.accessToken });
        });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
});
exports.refreshToken = refreshToken;
