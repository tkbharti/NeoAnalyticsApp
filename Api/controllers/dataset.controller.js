const { NotFoundError } = require("../helpers/utility");  
const DatasetModel  = require("../models/dataset.model");  

// Reusable response helper
const sendResponse = (res, success, message, data = [], status = 200) => {
  return res.status(status).json({ success, message, data });
}; 

exports.getDatasetRecord = async (req, res, next) => { 
	 const datasetrecord = await DatasetModel.getDatasetRecord(req.params.tblname);  
	try {		
		return sendResponse(res, true, "Get dataset record", datasetrecord); 
	}catch (err) {
        if (err instanceof NotFoundError) {
			return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 

exports.getColumnList = async (req, res, next) => { 
	 const datacolumn = await DatasetModel.getColumnList(req.params.tblname);  
	try {		
		return sendResponse(res, true, "Get dataset column", datacolumn); 
	}catch (err) {
        if (err instanceof NotFoundError) {
			return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
}  

exports.getRecordByColumn = async (req, res, next) => {  
	const formdata = req.body;  
	const dataset = await DatasetModel.getRecordByColumn(formdata);  
	try {		
		return sendResponse(res, true, "Get all dataset", dataset); 
	}catch (err) {
        if (err instanceof NotFoundError) {
			return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
}

exports.getDatasetList = async (req, res, next) => {  
	const dataset = await DatasetModel.getDatasetList();  
	try {		
		return sendResponse(res, true, "Get all dataset", dataset); 
	}catch (err) {
        if (err instanceof NotFoundError) {
			return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 

exports.saveDataset = async (req, res, next) => {
	const formdata = req.body; 
	formdata.status =  'A';
	formdata.created_by =  req.user.id;  
	formdata.updated_by =  req.user.id;  
	const datasetlist = await DatasetModel.saveDataset(formdata);  
	 try {		
		return sendResponse(res, true, "Saved dataset", datasetlist);   
	}catch (err) {
        if (err instanceof NotFoundError) {
            return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 

exports.updateDatasetRecord = async (req, res, next) => {
	const formdata = req.body; 
	formdata.status =  'D'; 
	formdata.updated_by =  req.user.id;  
	const datasetlist = await DatasetModel.updateDatasetRecord(formdata);  
	 try {		
		return sendResponse(res, true, "Saved dataset", datasetlist);   
	}catch (err) {
        if (err instanceof NotFoundError) {
            return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 
