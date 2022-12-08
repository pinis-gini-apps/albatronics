import express from 'express'
const router = express.Router();

import { userLogin, refreshToken } from '../../controllers/authController';

router.post('/login', userLogin);
router.get('/refresh_token', refreshToken);

export default router;
