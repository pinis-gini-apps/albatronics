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

router.get('/configuration', getAllSelection);

//post
router.post('/configuration', addRow);

//put
router.put('/configuration', editRow);

//delete
router.delete('/configuration/:id', deleteRow);

export default router;
