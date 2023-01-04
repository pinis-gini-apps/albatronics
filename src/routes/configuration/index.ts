import express from 'express';
const router = express.Router();

import { getByTypes } from '../../controllers/configuration';

//get
router.get('/:types/byTypes', getByTypes);


export default router;
