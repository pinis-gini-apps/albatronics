import express from 'express';
const router = express.Router();
import { getByType, getAllSelection, addRow, editRow, deleteRow, getByDataType, getByName  } from '../../controllers/configuration';

router.get('/byTypesIds', getByType);
router.get('/byNames', getByName);
router.get('/byDataTypes', getByDataType);
router.get('/all', getAllSelection);

//post
router.post('/', addRow);

//put
router.put('/', editRow);

//delete
router.delete('/', deleteRow);

//get

export default router;
