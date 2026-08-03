import React, { useState, useEffect, useCallback } from "react";
 
import { useTheme } from '../../context/ThemeContext';  
import { useLoading } from '../../context/LoadingContext';  

const Browsefile = ({dataChange})=>{ 
    const { theme }                         = useTheme();  
    const { setLoading }                    = useLoading();
    const [isProcessing, setIsProcessing] = useState(false);
    const [inputKeys, setInputKeys] 	 	= useState([0]);
    const [selectedFiles, setSelectedFiles] = useState([]); 
    const [error, setError] 			    = useState("");   
    //const [jsonData, setJsonData] = useState([]);
    const handleError = async (error) =>{
        if (error.response) { 
            setError(error.response.data.message); 
        } else if (error.request) { 
            setError('Network Error:', error.request);
        } else { 
            setError('Unknown Error:', error.message);
        }
    }

    function csvToJson(csvString) {
        const rows = csvString.split("\n"); 
        const headers = rows[0].split(","); 
        const jsonData = [];
        for (let i = 1; i < rows.length; i++) { 
            if(rows[i]){
                const values = rows[i].split(","); 
                const obj = {}; 
                for (let j = 0; j < headers.length; j++) {  
                    const key   = headers[j].trim().replace(/"/g, '').replace(/ /g, "_");
                    const value = values[j].trim().replace(/"/g, ''); 
                    obj[key] = value;
                } 
                jsonData.push(obj);
            }
        }
        return jsonData;
    }
 

    function transformToFlatDataset(data) {
        if (!Array.isArray(data) || data.length === 0) return [];

        // 🔹 Flatten single row
        function flattenRow(row, parentKey = '', result = {}) {
            Object.keys(row).forEach(key => {
            const value = row[key];
            const newKey = parentKey ? `${parentKey}_${key}` : key.replace(/ /g, "_");

            // 🟡 Array → comma-separated string
            if (Array.isArray(value)) {
                result[newKey] = value.join(',');
            }

            // 🟡 Nested object → flatten
            else if (typeof value === 'object' && value !== null) {
                flattenRow(value, newKey, result);
            }

            // 🟢 Boolean → 1/0
            else if (typeof value === 'boolean') {
                result[newKey] = value ? 1 : 0;
            }

            // 🟢 Normal values
            else {
                result[newKey] = value ?? null;
            }
            });

            return result;
        }

        // 🔹 Step 1: Flatten all rows
        const flatData = data.map(row => flattenRow(row));

        // 🔹 Step 2: Collect ALL columns (union)
        const columnSet = new Set();
        flatData.forEach(row => {
            Object.keys(row).forEach(col => columnSet.add(col));
        });

        const columns = Array.from(columnSet);

        // 🔹 Step 3: Normalize rows (fill missing keys with null)
        const normalizedData = flatData.map(row => {
            const newRow = {};
            columns.forEach(col => {
            newRow[col] = row[col] ?? null;
            });
            return newRow;
        });

        return normalizedData;
    }

    const handleFileChange = (event) => {
		const file = event.target.files?.[0];   
        if (file) {
            // Ensure the selected file is a JSON file
            if (file.type !== "application/json" && file.type !=="text/csv" ) {
                setError("Please select a valid JSON file.");
                dataChange([]);
                return;
            }

            const reader = new FileReader();
            // Define the onload function to handle the file content once read
            reader.onload = (e) => {
                const text = e.target?.result; 
                if (file.type === "text/csv"){
                    var tempdata = csvToJson(text); 
                    const fixedJSON = JSON.stringify(tempdata).replace(/([a-zA-Z0-9_$]+)\s*:/g, '"$1":').replace(/'([^']+)'/g, '"$1"');
                    var jsondata = JSON.parse(fixedJSON);  
                } else if (file.type === "application/json"){
                    //const fixedJSON = text.replace(/([a-zA-Z0-9_$]+)\s*:/g, '"$1":').replace(/'([^']+)'/g, '"$1"');
                    var jsondata = JSON.parse(text);  
                } 
                
                try {

                     var newjson = jsondata;
                    if (!Array.isArray(jsondata)) {
                        newjson = [jsondata]; 
                    }

                    // Attempt to parse the text content as JSON  
                    const newjsondata = transformToFlatDataset(newjson);  
                    dataChange(newjsondata);
                    setError(null); 
                } catch (err) {
                    // Handle parsing errors (e.g., invalid JSON format)
                    setError("Error parsing JSON file. Please ensure the file content is valid JSON.");
                    dataChange([]);
                }
            };

            // Define onerror to handle potential reading errors
            reader.onerror = (e) => {
                setError("Error reading file: " + e.target?.error.name);
            };

            // Read the file content as text
            reader.readAsText(file); 
        } 
	}

    const handleUpload = async (event) => { 
        event.preventDefault();  
    }	

    return (
        <form onSubmit={(e) => handleUpload(e)} name={`scr-0`}>
            <div className="row" style={{padding:'20px'}}>
                <div className="col-3"></div>
                <div className="col-6"> 
                    <input type="file"  
                    accept=".json,.csv" 
                    className={`form-control form-control-sm btn btn-${theme.color} btn-sm`} 
                    required
                    id="browsefile"
                    key={inputKeys[0]}  
                    onChange={(e) => handleFileChange(e)}
                    />
                    <br />
                    
                    <pre>
                        {`Upload your plain JSON array here i.e., [ {"A":"a"},{"B":"b"}]`} 
                    </pre>
                    
                </div>
                <div className="col-3">  
                     
                </div>  
            </div>  
        </form>
    );	 
}

export default Browsefile;