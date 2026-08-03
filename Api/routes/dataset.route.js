const router         = require('express').Router();
const {loggedIn}     = require('../helpers/auth.middleware');
const logMiddleware  = require("../helpers/log.middleware"); 

const DatasetController = require('../controllers/dataset.controller'); 

router.get('/getcolumnlist/:tblname', loggedIn, logMiddleware, DatasetController.getColumnList); 
router.get('/getdatasetrecord/:tblname', loggedIn, logMiddleware, DatasetController.getDatasetRecord); 
router.get('/getdatasetlist', loggedIn, logMiddleware, DatasetController.getDatasetList);   
router.post('/savedataset', loggedIn, logMiddleware, DatasetController.saveDataset); 
router.post('/getrecodbycolumn', loggedIn, logMiddleware, DatasetController.getRecordByColumn); 
router.post('/updatedatasetrecord', loggedIn, logMiddleware, DatasetController.updateDatasetRecord); 


module.exports = router;