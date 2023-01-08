import express from 'express';
const router = express.Router();
import { getByType } from '../../controllers/configuration';

//get
router.get('/byTypes', getByType);

export default router;
