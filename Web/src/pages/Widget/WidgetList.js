 
import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { createRoot } from 'react-dom/client';

import {  Braces, X , Table, Download, Save, ArrowUpRight, Trash2, Edit} from 'lucide-react';

import { CButton,  CRow,  CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CBadge
 } from '@coreui/react';
 

import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'tabulator-tables/dist/css/tabulator.min.css'; 
import 'tabulator-tables/dist/css/tabulator_simple.min.css'; 
import { useNavigate } from 'react-router-dom';
import WidgetTabUi from "./WidgetTabUi";

import { useTheme } from '../../context/ThemeContext'; 
import { useLoading } from '../../context/LoadingContext';  
import {WidgetService} from "../../services/apiService"; 
 
Tabulator.registerModule([]);

const WidgetList = ()=>{ 
    const { theme } = useTheme();  
    const navigate  = useNavigate();
    const tableRef 	= useRef(null);
    const [error, setError] 			    = useState("");   
    const [datasename, setDataseName] 	    = useState("");   
    const [alertvisible, setAlertVisible] 	= useState(false);   
    const [processdetails, setProcessesData]= useState([]);   
    const [column, setColumn]               = useState([]); 
    const [table, setTable]         = useState(null);  
    const [celldata, setCellData]   = useState();   
    
    const handleError = async (error) =>{
        if (error.response) { 
            setError(error.response.data.message); 
        } else if (error.request) { 
            setError('Network Error:', error.request);
        } else { 
            setError('Unknown Error:', error.message);
        }
    }

    const handleWidgetEditClick = (cell) => {  
        const id = cell.getRow().getData().id;
        navigate(`/widget/${id}`);  
    };
   
    useLayoutEffect(() => {
        if (!tableRef.current) return; 
            const timeout = setTimeout(() => {
                const tableInstance = new Tabulator(tableRef.current, { 
                    data: processdetails, 
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
                    
                }); 
                setTable(tableInstance); 
            }, 100);  

            return () => {
                clearTimeout(timeout);  
            }

    }, [processdetails]); 

   const loadData =  useCallback(async () => { 
        try {  
            const response =  await WidgetService.getWidgetList(); 
                    const colshow = ['id','Widget Name','Widget Type'];
                    const cols = ['id','widgetname','widgettypelabel']
                        .map((key, index) => ({
                            title: colshow[index],
                            field: key,
                            headerHozAlign: 'left',
                            hozAlign: 'left',  
                            resizable:true,
                            headerSort:true, 
                            visible:key==='id'? false:true,
                            sorter:"string", 
                            headerSortStartingDir:"asc" 
                        }));  
                        
                         cols.push({ 
                            formatter: function(cell) {
                                const cellElement = cell.getElement(); 
                                    cellElement.innerHTML = '';  
                                    const root = createRoot(cellElement);
                                    root.render(<Edit size={15} className={`txt-${theme.color}`} />);  

                            } ,
                            width:30, 
                            hozAlign:"center", 
                            cellClick:  async function(e, cell){ 
                                setCellData(cell); 
                                handleWidgetEditClick(cell);
                            } 
                        });

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
            setProcessesData(response.data); 
        } catch (error) {
            handleError(error); 
        }   
    },[]);

    useEffect(() => { 
        loadData();
    },[]); 

    useEffect(() => {
    if (!table) return; 
        table.replaceData(processdetails); 
    }, [processdetails, table]); 
    
    const deleteRecord = async ()=>{ 
        celldata.getRow().delete();
        const bodyparam ={
            id:celldata.getRow().getData().id,
            tblname:celldata.getRow().getData().tblname
        } 
        try {  
            const response =  await WidgetService.deleteWidgetRecord(bodyparam);
        } catch (error) {
            handleError(error); 
        }finally{
            setAlertVisible(false);
            setCellData()
        } 
    }

    return (
        <div className="p-0">   
            <WidgetTabUi tabnoumber={2} />   
            <div style={{padding:'5px'}}></div> 
 
                <div className="card"> 
                    <div className={`card-header d-flex justify-content-between align-items-center 
                text-white txt-${theme.color}`} style={{padding:'4px',backgroundColor:"#e1e1e1"}}> 
                    
                        <div style={{width:'90%',display: 'flex'}}> 
                            <div style={{ textAlign:'left', display:'inline-block', paddingLeft:'1%'}}>
                                <Table size={18} /><strong> Available Widget List</strong>   
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
                        <CButton color="secondary"
                         onClick={() =>{setAlertVisible(false);setCellData()}}>
                            Close
                        </CButton>
                        <CButton className={`btn bg-${theme.color}`}  
                         onClick={() =>deleteRecord()}>
                            OK
                        </CButton>        
                        </CModalFooter>
                       
                </CModal> 
                
                    
            
      </div>   

    );
}
export default WidgetList;