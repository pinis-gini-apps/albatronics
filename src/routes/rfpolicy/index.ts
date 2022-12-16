import express from 'express';
import { getRFpolicy, blockRFpolicy, allowRFpolicy } from '../../controllers/rfpolicy';
const router = express.Router();

//get
router.get('/', getRFpolicy);

router.put('/blocked', blockRFpolicy);
router.put('/allowed', allowRFpolicy);

export default router;
