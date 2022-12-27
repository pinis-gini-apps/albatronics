import express from 'express';
const router = express.Router();

import { setUserConfig, getUserConfig, getUserInfo } from '../../controllers/user';

router.get('/:id', getUserInfo);
router.get('/config/:userRole/:all', getUserConfig);
router.post('/config', setUserConfig);

// router.put('/password/reset', resetPassword);
// router.put('/password/reset/:id', resetAnotherPassword);

export default router;
