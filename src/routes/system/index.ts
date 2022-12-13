import express from 'express';
const router = express.Router();

import { getSystemStatus } from '../../controllers/system';

//get
router.get('/status/system', getSystemStatus);
router.get('/all-selection');
router.get('/status/cellular');

//post
router.post('/all-selection');

//put
router.put('/all-selection');

//delete
router.delete('/all-selection/:id');

export default router;
