const { NotFoundError } = require("../helpers/utility");  
const ReportModel  = require("../models/report.model");  

// Reusable response helper
const sendResponse = (res, success, message, data = [], status = 200) => {
  return res.status(status).json({ success, message, data });
}; 
 

exports.getReportList = async (req, res, next) => {  
	const dataset = await ReportModel.getReportList();  
	try {		
		return sendResponse(res, true, "Get all reports", dataset); 
	}catch (err) {
        if (err instanceof NotFoundError) {
			return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 

exports.getReportData = async (req, res, next) => {
	const id = req.params.id;
	const dataset = await ReportModel.getReportData(id);  
	try {		
		return sendResponse(res, true, "Get report data", dataset); 
	}catch (err) {
        if (err instanceof NotFoundError) {
			return sendResponse(res, false, "Error", dataset, 500); 
        }
		return next(err);
    } 
} 


exports.saveReport = async (req, res, next) => {
	const formdata = req.body; 
     
	formdata.status =  'A';
	formdata.created_by =  req.user.id;  
	formdata.updated_by =  req.user.id;  
	const reportlist = await ReportModel.saveReport(formdata);  
	 try {		
		return sendResponse(res, true, "Saved report", reportlist);   
	}catch (err) {
        if (err instanceof NotFoundError) {
            return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
}

exports.updateReportRecord = async (req, res, next) => {
	const formdata = req.body;
	formdata.updated_by =  req.user.id;  
	const reportlist = await ReportModel.updateReportRecord(formdata);  
	 try {		
		return sendResponse(res, true, "Updated report", reportlist);   
	}catch (err) {
        if (err instanceof NotFoundError) {
            return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 

exports.deleteReportRecord = async (req, res, next) => {
	const formdata = req.body; 
	formdata.status =  'D'; 
	formdata.updated_by =  req.user.id;  
	const reportlist = await ReportModel.deleteReportRecord(formdata);  
	 try {		
		return sendResponse(res, true, "Deleted report", reportlist);   
	}catch (err) {
        if (err instanceof NotFoundError) {
            return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 