import express from 'express';
const router = express.Router();

import { userLogin, refreshToken } from '../../controllers/auth';

router.post('/login', userLogin);
router.get('/update', refreshToken);

export default router;
