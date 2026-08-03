const router         = require('express').Router();
const {loggedIn}     = require('../helpers/auth.middleware');
const logMiddleware  = require("../helpers/log.middleware"); 

const WidgetController = require('../controllers/widget.controller'); 
router.get('/getwidgetlist', loggedIn, logMiddleware, WidgetController.getWidgetList);  
router.get('/getwidgetdata/:id', loggedIn, logMiddleware, WidgetController.getWidgetData);  
router.post('/savewidget', loggedIn, logMiddleware, WidgetController.saveWidget); 
router.post('/updatewidgetrecord', loggedIn, logMiddleware, WidgetController.updateWidgetRecord); 
router.post('/deletewidgetrecord', loggedIn, logMiddleware, WidgetController.deleteWidgetRecord); 

module.exports = router;