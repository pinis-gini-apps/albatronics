import express from 'express';
const router = express.Router();

import { getSystemStatus, getCellularInfo, getPerformanceInfo, getEpcLicense, getSoftwareVersion, getAllSelection, deleteRow } from '../../controllers/system';

//get
router.get('/status/system', getSystemStatus);
router.get('/all-selection', getAllSelection);
router.get('/status/cellular', getCellularInfo);
router.get('/status/performance', getPerformanceInfo);
router.get('/general/epc-license', getEpcLicense);
router.get('/general/software-version', getSoftwareVersion);

//post
router.post('/all-selection');

//put
router.put('/all-selection');

//delete
router.delete('/all-selection/:id', deleteRow);

export default router;
