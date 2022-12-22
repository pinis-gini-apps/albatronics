import express from 'express';
const router = express.Router();

import { setUserConfig, getUserConfig } from '../../controllers/user';

router.get('/config/:userRole', getUserConfig);
router.post('/config', setUserConfig);

// router.put('/password/reset', resetPassword);
// router.put('/password/reset/:id', resetAnotherPassword);

export default router;
