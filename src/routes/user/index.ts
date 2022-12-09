import express from 'express'
const router = express.Router();

import { resetPassword, resetAnotherPassword} from '../../controllers/userController';

router.put('/password/reset', resetPassword)
router.put('/password/reset/:id', resetAnotherPassword)

export default router;
