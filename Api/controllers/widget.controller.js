const { NotFoundError } = require("../helpers/utility");  
const WidgetModel  = require("../models/widget.model");  

// Reusable response helper
const sendResponse = (res, success, message, data = [], status = 200) => {
  return res.status(status).json({ success, message, data });
}; 
 

exports.getWidgetList = async (req, res, next) => {  
	const dataset = await WidgetModel.getWidgetList();  
	try {		
		return sendResponse(res, true, "Get all widgets", dataset); 
	}catch (err) {
        if (err instanceof NotFoundError) {
			return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 

exports.getWidgetData = async (req, res, next) => {
	const id = req.params.id;
	const dataset = await WidgetModel.getWidgetData(id);  
	try {		
		return sendResponse(res, true, "Get widget data", dataset); 
	}catch (err) {
        if (err instanceof NotFoundError) {
			return sendResponse(res, false, "Error", dataset, 500); 
        }
		return next(err);
    } 
} 


exports.saveWidget = async (req, res, next) => {
	const formdata = req.body; 
	formdata.status =  'A';
	formdata.created_by =  req.user.id;  
	formdata.updated_by =  req.user.id;  
	const widgetlist = await WidgetModel.saveWidget(formdata);  
	 try {		
		return sendResponse(res, true, "Saved widget", widgetlist);   
	}catch (err) {
        if (err instanceof NotFoundError) {
            return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
}  

exports.updateWidgetRecord = async (req, res, next) => {
	const formdata = req.body;
	formdata.updated_by =  req.user.id;  
	const widgetlist = await WidgetModel.updateWidgetRecord(formdata);  
	 try {		
		return sendResponse(res, true, "Updated widget", widgetlist);   
	}catch (err) {
        if (err instanceof NotFoundError) {
            return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 

exports.deleteWidgetRecord = async (req, res, next) => {
	const formdata = req.body; 
	formdata.status =  'D'; 
	formdata.updated_by =  req.user.id;  
	const widgetlist = await WidgetModel.deleteWidgetRecord(formdata);  
	 try {		
		return sendResponse(res, true, "Deleted widget", widgetlist);   
	}catch (err) {
        if (err instanceof NotFoundError) {
            return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 
