import express from 'express';
const router = express.Router();

import {
    getSystemStatus,
    getCellularInfo,
    getPerformanceInfo,
    getEpcLicense,
    getSoftwareVersion,
    getAllSelection,
    deleteRow,
    addRow,
    editRow,
} from '../../controllers/system';

//get
router.get('/status/system', getSystemStatus);
router.get('/status/cellular', getCellularInfo);
router.get('/status/performance', getPerformanceInfo);

router.get('/general/epc-license', getEpcLicense);
router.get('/general/software-version', getSoftwareVersion);

router.get('/all-selection', getAllSelection);

//post
router.post('/all-selection', addRow);

//put
router.put('/all-selection', editRow);

//delete
router.delete('/all-selection/:id', deleteRow);

export default router;
