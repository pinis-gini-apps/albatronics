import express from 'express';
const router = express.Router();

import { setUserConfig, getUserInfo, getUserConfig } from '../../controllers/user';

router.get('/me', getUserInfo);

router.get('/config/:userRole', getUserConfig);
router.post('/config', setUserConfig);

// router.put('/password/reset', resetPassword);
// router.put('/password/reset/:id', resetAnotherPassword);

export default router;
