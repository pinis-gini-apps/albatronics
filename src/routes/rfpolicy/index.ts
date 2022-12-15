import express from 'express';
import { getRFpolicy } from '../../controllers/rfpolicy';
const router = express.Router();

//get
router.get('/', getRFpolicy);

export default router;
