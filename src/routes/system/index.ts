import express from 'express';
const router = express.Router();

import { getPerformanceInfo } from '../../controllers/system';

//get
router.get('/status/performance', getPerformanceInfo);

export default router;
