import express from 'express';
const router = express.Router();

import { getLedInfo } from '../../controllers/led';

//get
router.get('/info', getLedInfo);

//post
router.post('/strip');
router.post('/power');
router.post('/access');

export default router;
