import express from 'express';
const router = express.Router();
import { getENodeBInfo } from '../../controllers/enodeb';

//get
router.get('/', getENodeBInfo);

export default router;
