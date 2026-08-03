const router         = require('express').Router();
const {loggedIn}     = require('../helpers/auth.middleware');
const logMiddleware  = require("../helpers/log.middleware"); 

const ReportController = require('../controllers/report.controller'); 
router.get('/getreportlist', loggedIn, logMiddleware, ReportController.getReportList);  
router.get('/getreportdata/:id', loggedIn, logMiddleware, ReportController.getReportData);  
router.post('/savereport', loggedIn, logMiddleware, ReportController.saveReport); 
router.post('/updatereportrecord', loggedIn, logMiddleware, ReportController.updateReportRecord); 
router.post('/deletereportrecord', loggedIn, logMiddleware, ReportController.deleteReportRecord); 
 
module.exports = router;