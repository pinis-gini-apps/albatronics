import express from 'express';
const router = express.Router();

import { setUserConfig, getUserConfig, getUserInfo, getPing, getTimestamp } from '../../controllers/user';

router.get('/timestamp', getTimestamp);
router.get('/ping', getPing);
router.get('/config/:userRole/:all', getUserConfig);
router.get('/:id', getUserInfo);

// post
router.post('/config', setUserConfig);

// router.put('/password/reset', resetPassword);
// router.put('/password/reset/:id', resetAnotherPassword);

export default router;
