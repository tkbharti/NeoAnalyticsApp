import React, { useEffect, useRef, useState, useCallback,useLayoutEffect } from 'react'; 
import { X, Edit, Save, Plus, Trash2}   from 'lucide-react';
import {  CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle} from '@coreui/react';

import {useSetState} from 'react-use';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

import { CButton } from '@coreui/react'; 
import ReportTabUi from "./ReportTabUi";
import { useTheme } from '../../context/ThemeContext'; 

import {WidgetService,DatasetService,ReportService} from "../../services/apiService"; 

import { useParams, useNavigate } from 'react-router-dom';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'tabulator-tables/dist/css/tabulator.min.css'; 
import 'tabulator-tables/dist/css/tabulator_simple.min.css';  
 
Tabulator.registerModule([]);

import { createRoot } from 'react-dom/client';


import PivotWidget from '../Widget/Charts/PivotWidget';
import TableWidget from '../Widget/Charts/TableWidget';
import SimpleBarWidget from '../Widget/Charts/SimpleBarWidget';
import SimpleLineWidget from '../Widget/Charts/SimpleLineWidget';
import SimpleStepLineWidget from '../Widget/Charts/SimpleStepLineWidget';
import SimpleAreaWidget from '../Widget/Charts/SimpleAreaWidget';
import SimplePieWidget from '../Widget/Charts/SimplePieWidget';
import SimpleDoughnutWidget from '../Widget/Charts/SimpleDoughnutWidget';

import StackedBarWidget from '../Widget/Charts/StackedBarWidget';
import StackedLineWidget from '../Widget/Charts/StackedLineWidget';
import StackedStepLineWidget from '../Widget/Charts/StackedStepLineWidget';
import StackedAreaWidget from '../Widget/Charts/StackedAreaWidget'; 
import StackedHorizontalBarWidget from '../Widget/Charts/StackedHorizontalBarWidget';


const widgetRegistry = { 
        datatable: (props) => <TableWidget {...props} />,
        pivottable: (props) => <PivotWidget {...props} />,
        simplebarchart: (props) => <SimpleBarWidget {...props} />, 
        simplelinechart: (props) => <SimpleLineWidget {...props} />,
        simplesteplinechart: (props) => <SimpleStepLineWidget {...props} />,
        simpleareachart: (props) => <SimpleAreaWidget {...props} />,
        simplepiechart: (props) => <SimplePieWidget {...props} />,
        simpledoughnutchart: (props) => <SimpleDoughnutWidget {...props} />, 

        stackedbarchart: (props) => <StackedBarWidget {...props} />, 
        stackedlinechart: (props) => <StackedLineWidget {...props} />, 
        stackedsteplinechart: (props) => <StackedStepLineWidget {...props} />, 
        stackedareachart: (props) => <StackedAreaWidget {...props} />,   
        horisontalstackedbar: (props) => <StackedHorizontalBarWidget {...props} />,  
};  

const widgetParameterUi = { 
    datatable: (props) => <DataTableParam  {...props} />,
    pivottable: (props) => <DataTableParam {...props} />,
    simplebarchart: (props) => <CommonParam {...props} />,
    simplelinechart: (props) => <CommonParam {...props} />,
    simplesteplinechart: (props) => <CommonParam {...props} />,
    simpleareachart: (props) => <CommonParam {...props} />,
    simplepiechart: (props) => <CommonParam {...props} />,
    simpledoughnutchart: (props) => <CommonParam {...props} />, 

    stackedbarchart: (props) => <StackedChartParam {...props} />, 
    stackedlinechart: (props) => <StackedChartParam {...props} />, 
    stackedsteplinechart: (props) => <StackedChartParam {...props} />, 
    stackedareachart: (props) => <StackedChartParam {...props} />,  
    horisontalstackedbar: (props) => <StackedChartParam {...props} />,  
};  

const widgetPropertiesUi = {
    datatable: (props) => <DataTableProp {...props}  /> ,
    pivottable: (props) => <DataTableProp {...props} />, 
    simplebarchart: (props) => <SimpleBarProp {...props} />, 
    simplelinechart: (props) => <SimpleBarProp {...props} />,
    simplesteplinechart: (props) => <SimpleBarProp {...props} />,
    simpleareachart: (props) => <SimpleBarProp {...props} />,
    simplepiechart: (props) => <SimpleBarProp {...props} />,
    simpledoughnutchart: (props) => <SimpleBarProp {...props} />, 

    stackedbarchart: (props) => <SimpleBarProp {...props} />, 
    stackedlinechart: (props) => <SimpleBarProp {...props} />, 
    stackedsteplinechart: (props) => <SimpleBarProp {...props} />, 
    stackedareachart: (props) => <SimpleBarProp {...props} />, 
    horisontalstackedbar: (props) => <SimpleBarProp {...props} />,  

} 
 
 
const Widget = ({ id, data, w, h,widgetname, onAdd, onRemove }) => { 
    return (
        <div className="grid-stack-item-content" 
            style={{ background: '#fff', border: '1px solid #ddd', padding: '0px',overflow:'hidden' }}>
            <div className={``} style={{padding:'2px', background: '#F4F4F5'}}>
                    <div style={{ width:'80%',  textAlign:'center', float:'left', fontSize:'14px',
                        whiteSpace: 'nowrap',  overflow: 'hidden',textOverflow: 'ellipsis'
                    }}>{widgetname}</div>
                    <div style={{ textAlign:'right', marginTop:'-3px'}}> 
                        <Edit size={15} onClick={() => onAdd(id)} style={{cursor:'pointer'}} />
                        <Trash2 size={15} onClick={() => onRemove(id)} style={{cursor:'pointer'}} />
                    </div>
            </div> 
            <div style={{padding:'2px'}}>

                {data && (() => {
                    const SelectedWidget = widgetRegistry[data.widgettype];  
                    return SelectedWidget ? (
                        <SelectedWidget 
                        w={w}
                        h={h}
                        data={data.data} 
                        wprop={data.wprop} 
                        wparam={data.wparam} 
                         report={true}   
                        />
                    ) : (
                        <div>Widget not found</div>
                    );
                })()}
  

            </div> 
        </div>
    );
};

let counter = 1;

const nextId = () => { 
    return counter++;
};

const newId = () => {
    counter = (counter + 1) % 100000;
    return `${Date.now()}${counter}`;
};

// Main Reusable Grid Component
const GridStackLayout = () => { 
    const { theme } = useTheme();   
    const { id } = useParams();  
    const navigate = useNavigate(); 
    const [widgets, setWidgets] = useState([]);
    const [layout, setLayout] = useState([]);
    const gridRef = useRef(null);
    const gridEl = useRef(null);
    const modalInputRef     = useRef(null);  

    const [w_width, setW]  = useState(0);
    const [h_height, setH]  = useState(0);

    const isEdit = Boolean(id);
    const [state, setState] = useSetState({
        visible:false,
        savevisible:false,
        modalInput:"",
        currentid:"" 
    }); 

    const [idList, setIdList] = useState([]);
    const [dataList, setDataList] = useState([]);

    const tableRef 	= useRef(null);
    const [processdetails, setProcessesData]= useState([]);   
    const [column, setColumn]               = useState([]); 
    const [table, setTable]         = useState(null);  
    const [celldata, setCellData]   = useState(); 
      
    // Initialize Grid
    useEffect(() => { 
        if (!gridRef.current) {
            gridRef.current = GridStack.init({ 
                    float: false,
                    margin: 5,
                    cellHeight: 100, 
                    animate: true,
                },
                gridEl.current
            );  
             
            gridRef.current.on('change', (event, el) => {  
                const saved = gridRef.current.save();
                setLayout(saved); 
            });

            gridRef.current.on('resizestop', function(event, element) {   
                setWidgets(prev =>
                    prev.map(w =>
                        w.id === element.id ? { ...w, 
                            w_width:element.offsetWidth,h_height:element.offsetHeight} : w
                    )
                );    
                setW(element.offsetWidth);
                setH(element.offsetHeight);  
            });   
            
        } 
        return () => {
            gridRef.current?.destroy(false);
            gridRef.current = null;
        };
    }, []); 

    useEffect(() => { 
         const loadReport = async () => {
            const response =  await ReportService.getReportData(id); 
            const widlist = JSON.parse(response.data[0].metadata);  

             setState((prev)=>({...prev,  modalInput:response.data[0].name })); 
            
            setIdList(widlist);
            const promises = widlist.map(async (item)=>{
                const wresult = await WidgetService.getWidgetData(item.widgetid);
                return wresult;
            }); 
            const results = await Promise.all(promises); 
            setDataList(results);
        }; 
        loadReport(); 
    },[id]);
    
    useEffect(() => {  
        if(dataList.length==0) return; 
        const loadData = async () => {
            const promises = dataList.map(async (wmetadata)=>{ 
                var data = {
                    id:wmetadata.data[0].id,
                    widgetname:wmetadata.data[0].widgetname,
                    widgettype:wmetadata.data[0].widgettype ,
                    data:[],
                    wprop: JSON.parse(wmetadata.data[0].widgetprop),
                    wparam: JSON.parse(wmetadata.data[0].widgetparams) 
                };  
                data.wparam.widgettype=wmetadata.data[0].widgettype;
                const response =  await DatasetService.getRecordByColumn(data.wparam);   
                data.data = response.data; 
                return data;
            });     
            
            const results = await Promise.all(promises); 

            idList.map((item,i)=>{  
                item.data   = { 
                    data:results[i].data,
                    widgettype :  results[i].widgettype,
                    wprop      :  results[i].wprop,
                    wparam     :  results[i].wparam
                }

                item.widgetid   =  results[i].id; 
                item.widgetname =  results[i].widgetname; 
                 
                item.w_width=item.w*100;
                item.h_height=item.h*100;
               
            });

           setWidgets(idList);  
 
        }; 
        loadData();  

    },[dataList]);     
  
    // Sync widgets with GridStack
    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return; 
        grid.batchUpdate();   
        widgets.forEach((w) => {
            const el = document.getElementById(w.id);  
            if (el && !el.gridstackNode) {
                grid.makeWidget(el);   
            }
        }); 
         
        grid.batchUpdate(false);
    }, [widgets]);
 
    const loadWidget = async () => { 

        if(!celldata)  return;
            const wmetadata = celldata.getData(); 
            const data = {
                widgettype:wmetadata.widgettype ,
                data:[],
                wprop: JSON.parse(wmetadata.widgetprop),
                wparam: JSON.parse(wmetadata.widgetparams),
            };  
             data.wparam.widgettype=wmetadata.widgettype;
        const response =  await DatasetService.getRecordByColumn(data.wparam);  
        data.data = response.data;
        
        const grid = gridRef.current; 

        //gridRef.current.cellHeight(50);
        const el = document.getElementById(state.currentid);
        if (grid && el) { 
            setWidgets(prev =>
                prev.map(w =>
                    w.id === state.currentid ? { ...w, 
                        w_width:w_width,h_height:h_height,
                        data:data, widgetid:wmetadata.id, widgetname: wmetadata.widgetname} : w
                )
            );  

            setState((prev)=>({...prev,  visible: false, currentid:"" })); 
         }  
        
        
        //grid?.resizeToContent(); 
    }; 
    
    const addReport = (id) => {  
        setState((prev)=>({...prev,  visible: true, currentid:id}));  
        loadWidgetList();
    }
 
    // Add Widget
    const addWidgetContainer = useCallback(() => { 
        const newWidget = { 
            w: 2,
            h: 2,
            x: undefined,
            y: undefined, 
            data: undefined,
            id: newId(), 
            widgetid:undefined,
            widgetname:`Widget ${nextId()}`, 
            w_width:setW(200),
            h_height:setH(200),
        };  
         

        setWidgets((prev) => [...prev, newWidget]);
    }, [widgets]);

    // Remove Widget
    const removeWidget = useCallback((id) => { 
        const grid = gridRef.current;
        const el = document.getElementById(id);

        if (grid && el) {
            grid.removeWidget(el, false);
        } 
        setWidgets((prev) => prev.filter((w) => w.id !== id));
    }, []);

    // Manual Save
    const saveReport = () => { 
         setState((prev)=>({...prev,  savevisible: true}));  
    };

    const handleSaveReport = async () => {  
        if (gridRef.current) {
            const saved = gridRef.current.save(false);  
            const updatedArray = saved.map(outerItem => { 
                const hasMatch = widgets.filter(innerItem => innerItem.id === outerItem.id); 
                return { ...outerItem, widgetid: hasMatch[0].widgetid}; 
            }); 

            setLayout(updatedArray);    
            const response = await ReportService.updateReportRecord({metadata: updatedArray, reportname:state.modalInput, id:id});
            setState((prev)=>({...prev,  savevisible: false}));  
        } 
    };

    const loadWidgetList =  useCallback(async () => { 
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
                                        root.render(
                                           <input type='radio' className='checkbox-select' name='row-select' />
                                        );  
    
                                } ,
                                width:30,  
                                hozAlign:"center", 
                                cellClick:  async function(e, cell){ 
                                     setCellData(cell); 
                                   // handleWidgetEditClick(cell);
                                } 
                            });
     
                        setColumn(cols); 
                 setProcessesData(response.data); 
            } catch (error) {
               // handleError(error); 
            }   
    },[]); 

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

    return (
     <div className="p-0"> 

            <ReportTabUi tabnoumber={3}  />   
   
            <div style={{padding:'5px'}}></div> 

                <div style={{ marginBottom: '10px', float:'right' }}>
                    <button  className={`btn btn-${theme.color} btn-sm`}
                    onClick={addWidgetContainer} style={{ cursor: 'pointer',marginRight:'10px' }}>
                    <Plus size={15} /> Add Widget
                    </button>
                    <button  className={`btn btn-${theme.color} btn-sm`}
                    
                    disabled={widgets?.length==0}
                    onClick={saveReport} style={{ color:'#FFF'  ,cursor: 'pointer' }}>
                    <Save size={15}/> Save Report
                    </button>
                </div>  
      
                <div 
                className={`txt-${theme.color}`}
                style={{padding:'10px', textAlign:'center', fontSize:'15px', fontWeight:'bold'}}>
                    Report Name :: {state.modalInput}    
                </div> 
                  
                <div ref={gridEl} className="grid-stack min-h-[400px]">
                    
                    {widgets.map((w) => (
                    <div
                        className="grid-stack-item" 
                        key={w.id}
                        id={w.id} 
                        gs-w={w.w}
                        gs-h={w.h}
                        gs-x={w.x}
                        gs-y={w.y}
                        gs-id={w.id}  
                        gs-widgetid={w.widgetid}
                        gs-widgetname={w.widgetname}  
                    >
                    
                     <Widget
                        id={w.id} 
                        data={w.data} 
                        w={w.w_width}
                        h={w.h_height}
                        widgetname={w.widgetname}
                        onAdd={addReport} 
                        onRemove={removeWidget} />
                        
                    </div>
                    ))}
                </div>

                <CModal  
                size='lg'
                scrollable 
                backdrop="static"
                visible={state.visible}
                onClose={(e) => {setCellData(); 
                setState((prev)=>({...prev,  visible: false, currentid:""}))}}>
                <CModalHeader className={`btn btn-${theme.color}`} 
                    closeButton={false}
                    style={{padding: '5px 10px',  
                    borderBottomLeftRadius:'0px',
                    borderBottomRightRadius:'0px'}}>  
                    <CModalTitle style={{'fontSize': '1rem'}}>
                        Widget List
                    </CModalTitle> 
                    <CButton onClick={(e) => {setCellData(); 
                    setState((prev)=>({...prev,  visible: false, currentid:""}))}} 
                        style={{padding:'0px', marginLeft:"86%" }}> 
                        <X style={{color:'#FFF',}} />
                    </CButton> 
                </CModalHeader> 
                <CModalBody>  
                      <div ref={tableRef}></div>  
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={(e) => {setCellData(); 
                    setState((prev)=>({...prev,  visible: false, currentid:""}))}}>
                        Close
                    </CButton>
                    <CButton className={`btn btn-${theme.color}`} 
                       onClick={loadWidget}
                       disabled={!celldata}
                        >Load
                    </CButton>
                </CModalFooter>
                </CModal>

                <CModal 
                    scrollable 
                    backdrop="static"
                    visible={state.savevisible}
                    onClose={(e) => setState({savevisible:false})}>
                    <CModalHeader className={`btn btn-${theme.color}`} 
                        closeButton={false}
                        style={{padding: '5px 10px',  
                        borderBottomLeftRadius:'0px',
                        borderBottomRightRadius:'0px'}}>  
                        <CModalTitle style={{'fontSize': '1rem'}}>
                            {isEdit ? 'Edit Report Name' : 'Add Report Name'}
                                
                        </CModalTitle> 
                        <CButton onClick={(e) => setState({savevisible:false})} 
                            style={{padding:'0px', marginLeft:"65%" }}> 
                            <X style={{color:'#FFF',}} />
                        </CButton> 
                    </CModalHeader> 
                    <CModalBody>  
                        <input ref={modalInputRef} name="gname"
                        className="form-control" placeholder="Report name"
                        value={state.modalInput} onChange={(e) => setState({modalInput:e.target.value})} />  
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={(e) => setState({savevisible:false})}>
                            Close
                        </CButton>
                        <CButton className={`btn btn-${theme.color}`} 
                            disabled={state.modalInput.length===0}                        
                            onClick={()=>handleSaveReport()}>Save
                        </CButton>
                    </CModalFooter>
                </CModal>        

                
    </div>
  );
};

export default GridStackLayout;
