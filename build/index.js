"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
// import middlewares
const authenticateToken_1 = __importDefault(require("./middleware/authenticateToken"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const config_1 = require("./config/config");
// import routes
const auth_1 = __importDefault(require("./routes/auth"));
// import userRouter from './routes/user';
const system_1 = __importDefault(require("./routes/system"));
const rfpolicy_1 = __importDefault(require("./routes/rfpolicy"));
const led_1 = __importDefault(require("./routes/led"));
const enodeb_1 = __importDefault(require("./routes/enodeb"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
const apiPath = '/api';
// app middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(config_1.corsOptions));
//app routers
app.use('/auth', auth_1.default);
// protected routes
app.use(`${apiPath}/system/`, authenticateToken_1.default, system_1.default);
app.use(`${apiPath}/rfpolicy`, authenticateToken_1.default, rfpolicy_1.default);
app.use(`${apiPath}/led/`, authenticateToken_1.default, led_1.default);
app.use(`${apiPath}/enodeb/`, authenticateToken_1.default, enodeb_1.default);
app.use(notFound_1.default);
app.use(errorHandler_1.default);
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
