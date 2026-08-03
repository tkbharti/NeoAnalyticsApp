import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { createRoot } from 'react-dom/client';

import {  View, Braces, X , Table, Download, Save, ArrowUpRight, Trash2} from 'lucide-react';

import { CButton,  CRow,  CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CBadge
 } from '@coreui/react';

 import {  
  CCloseButton,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle  
} from '@coreui/react';

import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'tabulator-tables/dist/css/tabulator.min.css'; 
import 'tabulator-tables/dist/css/tabulator_simple.min.css'; 

import CraftTabUi from "./CraftTabUi";

import { useTheme } from '../../context/ThemeContext'; 
import { useLoading } from '../../context/LoadingContext';  
import {DatasetService} from "../../services/apiService"; 
 
Tabulator.registerModule([]);

const DatasetList = ()=>{ 
    const { theme }                         = useTheme();  
    const { setLoading }                    = useLoading();
    const [isProcessing, setIsProcessing] = useState(false);
    const [inputKeys, setInputKeys] 	 	= useState([0]);
    const [selectedFiles, setSelectedFiles] = useState([]); 
    const [error, setError] 			    = useState("");   

    const [datasename, setDataseName] 	    = useState("");   

    const [alertvisible, setAlertVisible] 	    = useState(false);  

    const [processdetails, setProcessesData]= useState([]);   
    const [column, setColumn]= useState([]);  

    const [visible1, setVisible1]   = useState(false);
    const [visiblefirst, setVisibleSelect] = useState(false);
    
    const tableRef 	= useRef(null);
    const [table, setTable] = useState(null);  

    const [celldata, setCellData] = useState();  
    
    const datasetTableRef 	= useRef(null);
    const [datasettable, setDatasetTable] = useState(null); 
    const [processdetailsdataset, setProcessesDataset]= useState([]);   
    const [datasetcolumn, setDatasetColumn]= useState([]);  
    
    const handleError = async (error) =>{
        if (error.response) { 
            setError(error.response.data.message); 
        } else if (error.request) { 
            setError('Network Error:', error.request);
        } else { 
            setError('Unknown Error:', error.message);
        }
    }  

     useLayoutEffect(() => {
        if (!datasetTableRef.current) return; 
            const timeout = setTimeout(() => {
                const tableInstance = new Tabulator(datasetTableRef.current, { 
                    data: processdetailsdataset, 
                    height: "340px",
                    verticalFillMode: "fill", 
                    pagination: "local",
                    paginationSize: 10,
                    layout: "fitColumns",
                    placeholder: "Loading...",  
                    paginationSizeSelector:[5, 10, 25, 50,100],
                    movableColumns:true,
                    paginationCounter:"rows", 
                    columns: datasetcolumn 
                }); 
                setDatasetTable(tableInstance); 
            }, 100);  

            return () => {
                clearTimeout(timeout);  
            }

    }, [processdetailsdataset]);
   
    useLayoutEffect(() => {
        if (!tableRef.current) return; 
            const timeout = setTimeout(() => {
                const tableInstance = new Tabulator(tableRef.current, { 
                    data: [], 
                    height: "340px",
                    verticalFillMode: "fill", 
                    pagination: "local",
                    paginationSize: 10,
                    layout: "fitColumns",
                    placeholder: "No Record Found...",  
                    paginationSizeSelector:[5, 10, 25, 50,100],
                    movableColumns:true,
                    paginationCounter:"rows", 
                    columns: column,  
                    columnDefaults:{
                        tooltip:function(e, cell, onRendered){ 
                           // return "Click to view"; 
                        },
                    }
                }); 
                setTable(tableInstance); 
            }, 100);  

            return () => {
                clearTimeout(timeout);  
            }

    }, [processdetails]); 

   const loadData =  useCallback(async () => { 
        try {  
            const response =  await DatasetService.getDatasetList(); 
            if (response.data?.length > 0) { 
                if (column.length === 0) { 
                    
                    const cols = Object.keys(response.data[0]) 
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
                            cellClick: async function(e, cell){ 
                                const tblname = cell.getRow().getData().tblname;
                                setDataseName(cell.getRow().getData().Dataset); 
                                const response =  await DatasetService.getDatasetRecord(tblname); 
                                if (response.data?.length > 0) { 
                                    if (datasetcolumn.length === 0) {  
                                        const cols = Object.keys(response.data[0]) 
                                            .map((key) => ({
                                                title: key,
                                                field: key,
                                                headerHozAlign: 'left',
                                                hozAlign: 'left', 
                                                resizable:true,
                                                headerSort:true, 
                                                sorter:"string", 
                                                headerSortStartingDir:"asc" 
                                            }));  
                                        setDatasetColumn(cols);
                                    }
                                    setProcessesDataset(response.data);
                                } 
                                setVisible1(true);
                            } 
                        }));  


                    cols.push({ 
                        formatter: function(cell) {
                            const cellElement = cell.getElement(); 
                                cellElement.innerHTML = '';  
                                const root = createRoot(cellElement);
                                root.render(<View size={15} className={`txt-${theme.color}`} />);  
                        } ,
                        width:30, 
                        hozAlign:"center", 
                        cellClick:  async function(e, cell){ 
                             const tblname = cell.getRow().getData().tblname;
                                setDataseName(cell.getRow().getData().Dataset); 
                                const response =  await DatasetService.getDatasetRecord(tblname); 
                                if (response.data?.length > 0) { 
                                    if (datasetcolumn.length === 0) {  
                                        const cols = Object.keys(response.data[0]) 
                                            .map((key) => ({
                                                title: key,
                                                field: key,
                                                headerHozAlign: 'left',
                                                hozAlign: 'left', 
                                                resizable:true,
                                                headerSort:true, 
                                                sorter:"string", 
                                                headerSortStartingDir:"asc" 
                                            }));  
                                        setDatasetColumn(cols);
                                    }
                                    setProcessesDataset(response.data);
                                } 
                                setVisible1(true);
                        }

                    });
                    setColumn(cols); 
                    
                    cols.push({ 
                        formatter: function(cell) {
                            const cellElement = cell.getElement(); 
                                cellElement.innerHTML = '';  
                                const root = createRoot(cellElement);
                                root.render(<Trash2 size={15} className={`txt-${theme.color}`} />);  

                        } ,
                        width:30, 
                        hozAlign:"center", 
                        cellClick:  async function(e, cell){ 
                            setAlertVisible(true);
                            setCellData(cell); 
                        }

                    });
                    setColumn(cols);
                }
                setProcessesData(response.data);
            }
        } catch (error) {
            handleError(error); 
        }   
    },[]);

    useEffect(() => { 
        loadData();
    },[]);
     
    useEffect(() => { 
    if (!table || column.length === 0) return;  
        table.setColumns(column);  
    }, [column, table]); 

    useEffect(() => {
        if (!table) return; 
        if (processdetails.length===0) return; 
            table.replaceData(processdetails); 
    }, [processdetails, table]); 
    
    const deleteRecord = async ()=>{ 
        celldata.getRow().delete();
        const bodyparam ={
            id:celldata.getRow().getData().id,
            tblname:celldata.getRow().getData().tblname
        } 
        try {  
            const response =  await DatasetService.updateDatasetRecord(bodyparam);
        } catch (error) {
            handleError(error); 
        }finally{
            setAlertVisible(false);
            setCellData()
        } 
    }

    return (
        <div className="p-0">   
            <CraftTabUi tabnoumber={3}  />   
            <div style={{padding:'5px'}}></div> 
 
                <div className="card"> 
                    <div className={`card-header d-flex justify-content-between align-items-center 
                text-white txt-${theme.color}`} style={{padding:'4px',backgroundColor:"#e1e1e1"}}> 
                    
                        <div style={{width:'90%',display: 'flex'}}> 
                            <div style={{ textAlign:'left', display:'inline-block', paddingLeft:'1%'}}>
                                <Table size={18} /><strong> Available Dataset</strong>   
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

                <CModal
                        backdrop="static"
                        visible={alertvisible}
                        onClose={() => {setAlertVisible(false);setCellData()}}
                        >
                        <CModalHeader className={`btn btn-${theme.color}`} 
                            closeButton={false}
                            style={{padding: '5px 10px',  
                            borderBottomLeftRadius:'0px',
                            borderBottomRightRadius:'0px'}}>  
                            <CModalTitle style={{'fontSize': '1rem'}}>Alert</CModalTitle> 
                            <CButton onClick={() => {setAlertVisible(false);setCellData()}} 
                            style={{padding:'0px', marginLeft:'88%'}}> 
                              <X style={{color:'#FFF',}} />
                          </CButton>
                        </CModalHeader>
                        <CModalBody> 
                              Are you sure you want to delete this item?
                        </CModalBody>
                        <CModalFooter>
                        <CButton color="secondary" onClick={() =>{setAlertVisible(false);setCellData()}}>
                            Close
                        </CButton>
                        <CButton color="secondary" onClick={() =>deleteRecord()}>
                            OK
                        </CButton>        
                        </CModalFooter>
                       
                      </CModal> 
                
                <COffcanvas 
                      placement="bottom"  
                      className={visiblefirst?'w-100':'w-100'}
                      style={{"height": '75%'}} 
                      visible={visible1}  
                      onHide={() => {setVisible1(false);setProcessesDataset([])}}>
                      <COffcanvasHeader style={{"padding":"5px"}} className={`bg-${theme.color}`}>
                      <COffcanvasTitle style={{fontSize:'1rem'}}>{datasename}</COffcanvasTitle>
                      <CCloseButton white={visible1} 
                      onClick={() => {setVisible1(false);setProcessesDataset([])}} />
                      </COffcanvasHeader>
                      <COffcanvasBody> 
                          <div ref={datasetTableRef}></div> 
                      </COffcanvasBody>
                </COffcanvas>       
            
      </div>   

    );
}
export default DatasetList;