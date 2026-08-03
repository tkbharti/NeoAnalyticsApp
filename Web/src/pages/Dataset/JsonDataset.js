import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";

import { CButton,  CRow,  CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CBadge
 } from '@coreui/react';

import {  Braces, X , Table, Download, Save} from 'lucide-react';

import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'tabulator-tables/dist/css/tabulator.min.css'; 
import 'tabulator-tables/dist/css/tabulator_simple.min.css'; ///dist/css/tabulator_modern.min.css
 
import { useTheme } from '../../context/ThemeContext'; 
import { useLoading } from '../../context/LoadingContext';  

import CraftTabUi from "./CraftTabUi";

import {DatasetService} from "../../services/apiService"; 

Tabulator.registerModule([]);

const JsonDataset = () => { 
    const { theme }                         = useTheme();  
    const { setLoading }                    = useLoading();
    const [isProcessing, setIsProcessing] = useState(false);
    const [inputKeys, setInputKeys] 	 	= useState([0]);
    const [selectedFiles, setSelectedFiles] = useState([]); 
    const [error, setError] 			    = useState("");  
    
    const tableRef 	= useRef(null);
    const [table, setTable] = useState(null);  
 
    const [processdetails, setProcessesData]= useState([]);   
    const [column, setColumn]= useState([]);   
    const [pasteContent, setPasteContent] = useState(''); 

    const [message, setMessage]     = useState("");
    const [alertvisible, setAlertVisible]   = useState(false); 
    const [visible, setVisible]   = useState(false); 

    const modalInputRef                   = useRef(null); 
    const [modalInput, setModalInput]    = useState(""); 
     
    let counter = 0;
    const nextId = () => {
        counter = (counter + 1) % 1000;
        return `dataset_${Date.now()}${counter}`;
    };

    function isJsonArray(input) {
        try {
            const parsed = JSON.parse(input);
            return Array.isArray(parsed);
        } catch {
            return false;
        }
    }

    const handleError = async (error) =>{
        if (error.response) { 
        setError(error.response.data.message); 
        } else if (error.request) { 
        setError('Network Error:', error.request);
        } else { 
        setError('Unknown Error:', error.message);
        }
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

    const saveData = ()=>{ 
      setVisible(true);
    }

    const handleAddDataset = async ()=>{ 
        try {  
            let tickerdata = {
                name:modalInput,
                record:processdetails,
                tblname:nextId()
            }
            await DatasetService.saveDataset(tickerdata); 
        } catch (error) {
            handleError(error); 
        }finally{
            setVisible(false);
        }  
    }

    const getJsonData = (e)=>{  
        setPasteContent(e.target.value); 
    } 
    const clearTable = ()=>{  
         setProcessesData([]);
         setPasteContent("");
    }

    const prettyTable = ()=>{ 
        if(!isJsonArray(pasteContent)) {
         // setMessage("Not a valid JSON, use array of flat JSON");
         // setAlertVisible(true);
         //return;
       } 
        //var fixedJSON = pasteContent.replace(/([a-zA-Z0-9_$]+)\s*:/g, '"$1":').replace(/'([^']+)'/g, '"$1"');
        const filecontent = JSON.parse(pasteContent); 
        const prettyJson = JSON.stringify(filecontent, null, 2);
        setPasteContent(prettyJson);
    } 

    const downloadTable = (type) => {
        switch(type) {
            case 'csv':
                table.download("csv", "MyData.csv");
                break;
            case 'json':
                table.download("json", "MyData.json");
                break;
            case 'html':
                table.download("html", "MyData.html", { style: true });
                break;
            case 'xlsx':
                table.download("xlsx", "MyData.xlsx", { sheetName: "My Data" });
                break;
            case 'pdf':
                table.download("pdf", "data.pdf", { 
                    orientation: "portrait", 
                    title: "My Data"
                });
                break;
            default:
                console.warn("Invalid download type");
        }
    }
    
    const generateTable = ()=>{  
        if(pasteContent==="") return; 
        if(!isJsonArray(pasteContent)) {
           // setMessage("Not a valid JSON, use array of flat JSON");
          //  setAlertVisible(true);
           // return;
        } 
        //const fixedJSON = pasteContent.replace(/([a-zA-Z0-9_$]+)\s*:/g, '"$1":').replace(/'([^']+)'/g, '"$1"');
        const jsondata = JSON.parse(pasteContent);  

        var newjson = jsondata;
        if (!Array.isArray(jsondata)) {
            newjson = [jsondata]; 
        }

        const newjsondata = transformToFlatDataset(newjson); 
        
        if(newjsondata.length===0) return;
        setProcessesData(newjsondata);

        const cols = Object.keys(newjsondata[0]) 
                .map((key) => ({
                    title: key,
                    field: key,
                    headerHozAlign: 'left',
                    hozAlign: 'left',   
                    resizable:true,
                    headerSort:true,
                    visible:true,
                    sorter:"string", 
                    headerSortStartingDir:"asc",
                    editor:"input"  
                }));  
        setColumn(cols);  
        const timeout = setTimeout(() => {
            const tableInstance = new Tabulator(tableRef.current, { 
                data: newjsondata,
                columns: cols,  
                height: "340px",
                verticalFillMode: "fill", 
                pagination: "local",
                paginationSize: 10,
                layout: "fitColumns",
                placeholder: "Loading...",  
                paginationSizeSelector:[5, 10, 25, 50,100],
                movableColumns:true,
                paginationCounter:"rows", 
            }); 
            setTable(tableInstance); 
        },100); 
        return () => {
            clearTimeout(timeout);  
        }
    }  

    const DownloadUI = ()=>{
        return (
            <div style={{width:'100%', display:'flex'}}>
                <div style={{marginRight:'20px', width:'12%', cursor:'pointer'}} onClick={()=>downloadTable('csv')}>
                        <Download size={15}  />CSV   
                </div> 
                <div style={{marginRight:'20px', width:'12%', cursor:'pointer'}} onClick={()=>downloadTable('json')}>
                    <Download size={15}/>JSON  
                </div>

                <div style={{marginRight:'20px', width:'12%', cursor:'pointer'}} onClick={()=>downloadTable('pdf')}>
                    <Download size={15}/>PDF  
                </div>   
                <div style={{marginRight:'20px', width:'12%', cursor:'pointer'}} onClick={()=>downloadTable('xlsx')}>
                    <Download size={15}/>XLSX  
                </div>  
                
                <div style={{marginRight:'20px', width:'12%', cursor:'pointer'}} onClick={()=>downloadTable('html')}>
                    <Download size={15}/>HTML  
                </div>   
            </div> 
        );
    }
     
    return ( 
             <div className="p-0">   
                <CraftTabUi tabnoumber={1} />  
      
                    <div style={{padding:'5px'}}></div>

                    <div className="card">  

                        <div className={`card-header d-flex justify-content-between align-items-center 
                        text-white txt-${theme.color}`} style={{padding:'4px',backgroundColor:"#e1e1e1"}}>

                        <div style={{textAlign:'left', display:'inline-block', paddingLeft:'1%'}}>
                          <Braces size={18} />      
                         <strong> JSON Data</strong> 
                        
                        </div> 
                        </div>

                        <div className="row g-3">
                            <div className="col-12"> 
                                <div className="card-body p-3"> 
                                    <div className="row"
                                        style={{
                                        margin: '3px',
                                        padding: '5px 0px 1px 5px', 
                                        }}>

                                        <div className="col-10">       
                                            <textarea
                                            name="jsondata"
                                            placeholder={`Paste your plain JSON array here  i.e., \n [\n {'A':'a'},\n {'B':'b' }\n]`.replace(/\\n/g, '\n')}
                                            className="form-control"
                                            style={{ backgroundColor: '#FFF' }} 
                                            rows={6} 
                                            value={pasteContent} 
                                            onChange={(e)=>getJsonData(e)}
                                            />
                                        </div> 
                                        <div className="col-2">       
                                            <button type="submit" name="uploadButton" 
                                            style={{"width":"100%", color:'#FFF'}} 
                                            disabled={pasteContent===""}
                                            className={`btn btn-${theme.color} btn-sm`}
                                            onClick={()=>generateTable()}
                                            >
                                            Preview
                                            </button>

                                            <button type="submit" name="uploadButton" 
                                            style={{"width":"100%", marginTop:'10px', color:'#FFF'}} 
                                            className={`btn btn-${theme.color} btn-sm`}
                                            disabled={pasteContent===""}
                                            onClick={()=>clearTable()}
                                            >
                                            Clear
                                            </button>

                                            <button type="submit" name="uploadButton" 
                                            style={{"width":"100%", marginTop:'10px', color:'#FFF'}} 
                                            className={`btn btn-${theme.color} btn-sm`}
                                            disabled={pasteContent===""}
                                            onClick={()=>prettyTable()}
                                            >
                                             Prettify
                                            </button>    
                                            
                                      </div>      
                                    </div> 

                                </div>
                            </div>    
                        </div>
                    </div>

                    <div style={{"marginTop":"15px"}}></div>                        

                   { processdetails?.length>0 &&
                    <div className="card"> 
                        <div className={`card-header d-flex justify-content-between align-items-center 
                    text-white txt-${theme.color}`} style={{padding:'4px',backgroundColor:"#e1e1e1"}}>
                      
                            <div style={{width:'100%',display: 'flex'}}> 
                                <div style={{width:'40%',textAlign:'left', display:'inline-block', paddingLeft:'1%'}}>
                                    <Table size={18} /><strong> Available Records</strong>   
                                </div>  
                                <div style={{width:'50%',display: 'flex', textAlign:'right', padding:'2px', fontSize:'12px'}}> 
                                    <DownloadUI />   
                                </div>
                                <div style={{width:'10%',textAlign:'left', display:'inline-block', paddingLeft:'2%',cursor:'pointer'}}
                                 onClick={()=>saveData()}>     
                                    <Save size={18} />
                                </div>
                            </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12"> 
                                    <div className="card-body p-3"> 
                                            <div ref={tableRef}></div>  
                                    </div> 
                                </div> 
                            </div>  
                        
                    </div>
                    }
  
                <CModal
                    backdrop="static"
                    visible={alertvisible}
                    onClose={() => {setAlertVisible(false);}}
                 >
                <CModalHeader className={`btn btn-${theme.color}`} 
                    closeButton={false}
                    style={{padding: '5px 10px',  
                    borderBottomLeftRadius:'0px',
                    borderBottomRightRadius:'0px'}}>  
                    <CModalTitle style={{'fontSize': '1rem'}}>Alert</CModalTitle> 
                    <CButton onClick={() => setAlertVisible(false)} 
                    style={{padding:'0px', marginLeft:'88%'}}> 
                    <X style={{color:'#FFF',}} />
                    </CButton>
                </CModalHeader>
                <CModalBody> 
                    {message} 
                </CModalBody>
                <CModalFooter>
                <CButton color="secondary" onClick={() =>setAlertVisible(false)}>
                    Close
                </CButton> 
         </CModalFooter>
                </CModal>  

                <CModal 
                    scrollable 
                    backdrop="static"
                    visible={visible}
                    onClose={() => setVisible(false)}>
                    <CModalHeader className={`btn btn-${theme.color}`} 
                        closeButton={false}
                        style={{padding: '5px 10px',  
                        borderBottomLeftRadius:'0px',
                        borderBottomRightRadius:'0px'}}>  
                        <CModalTitle style={{'fontSize': '1rem'}}>Add Dataset Name </CModalTitle> 
                        <CButton onClick={() => setVisible(false)} 
                            style={{padding:'0px', marginLeft:"65%" }}> 
                            <X style={{color:'#FFF',}} />
                        </CButton> 
                    </CModalHeader>
                    
                        <CModalBody>  
                        <input ref={modalInputRef} name="gname"
                        className="form-control" placeholder="Dataset name"
                        value={modalInput} onChange={(e) => setModalInput(e.target.value)} />  
                        </CModalBody>
                        <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Close
                        </CButton>
                        <CButton className={`btn btn-${theme.color}`} 
                            disabled={modalInput.length===0}                        
                            onClick={handleAddDataset}>Save
                        </CButton>
                        </CModalFooter>
                </CModal>    


            </div>  
    );	 
}

export default JsonDataset;