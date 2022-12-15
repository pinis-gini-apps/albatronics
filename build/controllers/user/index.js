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
exports.resetPassword = void 0;
// import jwt from 'jsonwebtoken';
const db_1 = __importDefault(require("../../config/db/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
        return res.status(400).json({ message: 'Missing new or old password' });
    try {
        db_1.default.all('SELECT password, id FROM users WHERE id = ?', [req.user.user_id], (err, row) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return res.status(400).json({ message: 'User not found' });
            if (row.length > 0) {
                const user = row[0];
                const isMatched = yield bcrypt_1.default.compare(oldPassword, user.password);
                if (isMatched) {
                    const newHashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                    yield db_1.default.run('UPDATE users SET password = ? WHERE login_name = ?', [newHashedPassword, 'developer'], (err) => {
                        if (err)
                            return res.status(400).json({ message: err.message });
                        res.status(200).json({ message: 'Password changed.' });
                    });
                }
                else {
                    res.status(400).json({ message: 'Not matched passwords.' });
                }
            }
        }));
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.resetPassword = resetPassword;
// export const resetAnotherPassword = async (req: Request, res: Response) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token === null) res.status(401).json({ error: 'Null token' });
//     if (token) {
//         const decode = jwt.decode(token);
//         console.log(decode);
//     } else {
//         console.log('sadasd');
//     }
// };
