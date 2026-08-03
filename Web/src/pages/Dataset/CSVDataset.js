import React, { useState, useRef, useEffect, useCallback,useLayoutEffect  } from "react";
import { useTheme } from '../../context/ThemeContext'; 
import { useLoading } from '../../context/LoadingContext'; 
import {  File, Save, Table, Download, X} from 'lucide-react';
import { CButton,  CRow,  CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CBadge
 } from '@coreui/react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'tabulator-tables/dist/css/tabulator.min.css'; 
import 'tabulator-tables/dist/css/tabulator_simple.min.css'; 

import {DatasetService} from "../../services/apiService"; 

import Browsefile from "./Browsefile";  

import CraftTabUi from "./CraftTabUi";

Tabulator.registerModule([]);

const CSVDataset = () => { 
const { theme }                             = useTheme();  
    const { setLoading }                    = useLoading();
    const [isProcessing, setIsProcessing]   = useState(false);
    const [inputKeys, setInputKeys] 	 	    = useState([0]);
    const [selectedFiles, setSelectedFiles] = useState([]); 
    const [error, setError] 			          = useState("");   
 
    const tableRef 	= useRef(null);
    const [table, setTable] = useState(null);  

    const [processdetails, setProcessesData]= useState([]);   
    const [column, setColumn]= useState([]);    
    const handleError = async (error) =>{
        if (error.response) { 
            setError(error.response.data.message); 
        } else if (error.request) { 
            setError('Network Error:', error.request);
        } else { 
            setError('Unknown Error:', error.message);
        }
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

    useLayoutEffect(() => {
      if (!tableRef.current) return; 
          const timeout = setTimeout(() => { 
                const cols = Object.keys(processdetails[0]) 
                        .map((key) => ({
                        title: key,
                        field: key,
                        headerHozAlign: 'left',
                        hozAlign: 'left', 
                        resizable:true,
                        headerSort:true,
                        visible:key==='id'|| key==='tblname' ? false:true,
                        sorter:"string", 
                        headerSortStartingDir:"asc",  
                })); 
                
                
              const tableInstance = new Tabulator(tableRef.current, { 
                  data: processdetails,  
                  height: "340px",
                  verticalFillMode: "fill", 
                  pagination: "local",
                  paginationSize: 10,
                  layout: "fitColumns",
                  placeholder: "Loading...",  
                  paginationSizeSelector:[5, 10, 25, 50,100],
                  movableColumns:true,
                  paginationCounter:"rows", 
                  columns: cols,  
              }); 
              setTable(tableInstance); 
          }, 100);  

          return () => {
              clearTimeout(timeout);  
          }

  }, [processdetails]);

  const [visible, setVisible]   = useState(false); 
  
  const modalInputRef                   = useRef(null); 
  const [modalInput, setModalInput]    = useState(""); 
    
  let counter = 0;
  const nextId = () => {
      counter = (counter + 1) % 1000;
      return `dataset_${Date.now()}${counter}`;
  };

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
   
 return (

     <div className="p-0">   
        <CraftTabUi tabnoumber={2} />  
      
            <div style={{padding:'5px'}}></div>
          
            
            <div className="card"  style={{padding:"0px",border:'1px solid #ccccccfc', borderRadius:'5px'}}>  
              
               <div className={`card-header d-flex justify-content-between align-items-center 
                text-white txt-${theme.color}`} style={{padding:'4px',backgroundColor:"#e1e1e1"}}> 
                    
                        <div style={{width:'100%',display: 'flex'}}> 
                            <div style={{ textAlign:'left', display:'inline-block', paddingLeft:'1%'}}>
                                <File size={18} /><strong> Browse .json or .csv file  </strong>   
                            </div>   
                        </div>
                        </div>

              <div style={{padding:'2px'}}>
                <Browsefile dataChange={setProcessesData} />
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

export default CSVDataset;