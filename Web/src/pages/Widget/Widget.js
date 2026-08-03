import React,{useState, useEffect, useRef,useCallback ,memo  } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X, GridIcon, ArrowBigLeft, Save}   from 'lucide-react';
import "../../index.css";  

import {  CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle} from '@coreui/react';

import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.css';
 
import { useParams, useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';

import PivotWidget from './Charts/PivotWidget';
import TableWidget from './Charts/TableWidget';

import SimpleBarWidget from './Charts/SimpleBarWidget';
import SimpleLineWidget from './Charts/SimpleLineWidget';
import SimpleStepLineWidget from './Charts/SimpleStepLineWidget';
import SimpleAreaWidget from './Charts/SimpleAreaWidget';
import SimplePieWidget from './Charts/SimplePieWidget';
import SimpleDoughnutWidget from './Charts/SimpleDoughnutWidget';

import StackedBarWidget from './Charts/StackedBarWidget';
import StackedLineWidget from './Charts/StackedLineWidget';
import StackedStepLineWidget from './Charts/StackedStepLineWidget';
import StackedAreaWidget from './Charts/StackedAreaWidget'; 
import StackedHorizontalBarWidget from './Charts/StackedHorizontalBarWidget';

import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem } from '@coreui/react';
import {
  CFormSelect,  
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton
} from '@coreui/react';

import {DatasetService, WidgetService} from "../../services/apiService"; 

import { 
    DatasourceList,  
    DataTableParam, 

    SimpleChartParam, 
    StackedChartParam,

    DataTableProp, 
    SimpleBarProp, 
      
} from './WidgetUI';

import WidgetTabUi from "./WidgetTabUi";

import {useSetState} from 'react-use';
 
const Widget = ()=> { 
    const { theme } = useTheme();   
    const { id } = useParams();  
    const navigate = useNavigate();
    const [state, setState] = useSetState({
        widgettype:{}, 
        widgetreset:true,
        listofdataset:[],
        sourcetbl:"",
        sourcename:"",
        flist:[],
        activeIndex:1,
        data:[],
        selectedRowIds:[],
        setpg:"local",
        setheme:"default",
        setagg:"",
        setsize:"",
        setcolumn:"", 
        setaggof:"", 
        wprop:{}, 
        wparam:{}, 
        visible:false,
        modalInput:"",
        id:"",
        ppivot:{} ,

        orderby:"ASC",

        settitlein:"Report Title",
        settitlepos:"center",

        setlegendepos:'top',
        setlegendicon:"",
        setlegendori:"horizontal",       
        setsplitbar:'no'  

    });  
 
    const [allagg, setAllAgg] = useState([]);

    const isEdit = Boolean(id);
    const gridRef           = useRef(null);  
    const paginationRef     = useRef(null);  
    const themeRef          = useRef(null);  
    const aggregationRef    = useRef(null);   
    const sizeRef           = useRef(null);
    const columnRef         = useRef(null);  
    const aggregationOfRef  = useRef(null);     
    const modalInputRef     = useRef(null);  
    const paramRef          = useRef(null);  

    const orderRef          = useRef(null);  

    const titleinRef        = useRef(null); 
    const titlePosRef       = useRef(null); 
    
    const legendPosRef       = useRef(null); 
    const legendIconRef       = useRef(null); 
     
    const legendOriRef       = useRef(null); 
    const splitbarRef       = useRef(null); 
     
    
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

        simplebarchart: (props) => <SimpleChartParam {...props} />,
        simplelinechart: (props) => <SimpleChartParam {...props} />,
        simplesteplinechart: (props) => <SimpleChartParam {...props} />,
        simpleareachart: (props) => <SimpleChartParam {...props} />,
        simplepiechart: (props) => <SimpleChartParam {...props} />,
        simpledoughnutchart: (props) => <SimpleChartParam {...props} />, 

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

    const handleWidgetClick = () => {   
        setState({
            widgettype:{},
            widgetreset:true,
            selectedRowIds:[],
            activeIndex:1,
            flist:[],
            sourcetbl:"",
            sourcename:"",
            sourcename:"",
            data:[]
        });
        navigate(`/widget`);  
    };

    const handleError = async (error) =>{
        if (error.response) { 
            setError(error.response.data.message); 
        } else if (error.request) { 
            setError('Network Error:', error.request);
        } else { 
            setError('Unknown Error:', error.message);
        }
    } 
 
    const ParameterList = ()=>{   
        const allParams = {
            widgettype:state.widgettype,
            fieldlist:state.selectedRowIds, 
            setagg:state.setagg, 
            setsize:state.setsize, 
            setcolumn:state.setcolumn,
            setaggof:state.setaggof, 
            aggregationRef:aggregationRef, 
            sizeRef:sizeRef, 
            columnRef:columnRef,
            aggregationOfRef:aggregationOfRef,  
            setallcol:state.setallcol, 
            allagg: allagg,
            orderRef:orderRef,
            orderby:state.orderby, 
            setAllAgg:setAllAgg
        };
        
        const SelectedWidgetParam = widgetParameterUi[state.widgettype.wtype];
        return  <SelectedWidgetParam {...allParams} /> 
    } 
    
    const PropertiesList = ()=>{
        const allProps = { 
            setpg:state.setpg,  
            paginationRef:paginationRef,
            themeRef:themeRef,
            setheme:state.setheme, 
            
            titleinRef:titleinRef,
            settitlein:state.settitlein,

            titlePosRef:titlePosRef,
            settitlepos:state.settitlepos,

            legendPosRef:legendPosRef,
            setlegendepos:state.setlegendepos,
            legendIconRef:legendIconRef,
            setlegendicon:state.setlegendicon, 
            legendOriRef:legendOriRef,
            setlegendori:state.setlegendori,
            splitbarRef:splitbarRef,
            setsplitbar:state.setsplitbar 

        };
        const SelectedWidgetProps = widgetPropertiesUi[state.widgettype.wtype];
        return  <SelectedWidgetProps  {...allProps} /> 
    } 

    const widgetTypeList = async (grid, widgetprop) => {
        widgetprop.forEach((item) => {
                const el = document.createElement("div"); 
                el.innerHTML = `
                <div class="grid-stack-item-content" id="${item.id}">
                    <div class="card2 txt-${theme.color}">
                    <h6>${item.chartType}</h6>
                    </div>
                    <div class="row widgets-container"></div>
                </div>
                `;

                const container = el.querySelector(".widgets-container");

                item.widgets.forEach((widget) => {
                    const widgetHTML = `
                        <div class="col-12 container widget-item image-container" title="${widget.wname}">
                            <div class="top-div">
                                <img src="./chart/${widget.img}"  
                                class="gridstack-img" style="width:50px;height:50px" />
                            </div>
                            <div class="bottom-div txt-${theme.color}">
                                    ${widget.wname}
                            </div>
                        </div> 
                         `;

                    container.insertAdjacentHTML("beforeend", widgetHTML);
                });

                // ✅ Single event listener (event delegation)
                el.addEventListener("click", (e) => {
                    const target = e.target.closest(".widget-item");
                    if (!target) return;

                    const index = Array.from(container.children).indexOf(target);
                    const selected = item.widgets[index];

                    if (selected) {  
                        setState({ widgettype: {
                            wtype: selected.wtype,
                            wname: selected.wname,
                            wnameshow:selected.wnameshow
                        }});
                    }
                });

                grid.makeWidget(el, { w: 4, h: 2 });
            });
    };
    
    useEffect(() => { 
        if(!state.widgetreset) return;
        const grid = GridStack.init({
                column: 6,
                cellHeight: 60,  
                margin: 5, 
            },
                gridRef.current
        );

        const widgetprop = [
            {
                chartType :'Table',
                id:"widget-1",
                widgets:[ 
                    {wtype:"datatable", wname:"Data Table", wnameshow:"Data Table", img:'datatable.png'},
                    {wtype:"pivottable", wname:"Pivot Table", wnameshow:"Pivot Table", img:'pivottable.png'}
                ]
            },
            {
            chartType :'Basic',
                id:"widget-2",
                widgets:[ 
                    {wtype:"simplebarchart", wname:"Bar", wnameshow:"Basic Bar Chart", img:'barchart.png'},
                    {wtype:"simplelinechart", wname:"Line", wnameshow:"Basic Line Chart",  img:'linechart.png'}, 
                    {wtype:"simplesteplinechart", wname:"Step Line", wnameshow:"Basic Step Line Chart",  img:'steplinechart.png'}, 
                    {wtype:"simpleareachart", wname:"Area", wnameshow:"Basic Area Chart",  img:'areachart.png'},
                    {wtype:"simplepiechart", wname:"Pie", wnameshow:"Basic Pie Chart",  img:'piechart.png'} ,
                    {wtype:"simpledoughnutchart", wname:"Doughnut", wnameshow:"Basic Doughnut Chart",  img:'doughnutchart.png'} , 
                     
                ]
            },
            {
            chartType :'Stacked',
                id:"widget-3",
                widgets:[ 
                    {wtype:"stackedbarchart", wname:"Bar", wnameshow:"Stacked Bar Chart", img:'stackedbarchart.png'},
                    {wtype:"stackedlinechart", wname:"Line", wnameshow:"Stacked Line Chart", img:'stackedlinechart.png'},
                    {wtype:"stackedsteplinechart", wname:"Step Line",wnameshow:"Stacked Step Line Chart",  img:'stackedsteplinechart.png'}, 
                    {wtype:"stackedareachart", wname:"Area", wnameshow:"Stacked Area Chart", img:'stackedareachart.png'}, 
                    
                    {wtype:"horisontalstackedbar", wname:"Horizontal", wnameshow:"Horizontal Stacked Bar Chart",  img:'horisontalstackedbarchart.png'} , 
                     
                    
                ]
            }
        ];

        widgetTypeList(grid,widgetprop); 
        setState({widgetreset:false});
    }, [state.widgetreset]); 

    const fetchDeataset = async () => {
        try {
            const response =  await DatasetService.getDatasetList();   
            setState({listofdataset:response.data});
        }catch(error){
            
        }
    }

    useEffect(() => {
        fetchDeataset();
    },[]);
 
    const setDataset = async (item)=>{ 
        try { 
            const response =  await DatasetService.getColumnList(item.tblname); 
            setState({flist:response.data});  
            setState({sourcetbl:item.tblname}); 
            setState({sourcename:item.Dataset});
            setState({selectedRowIds:[]});
            setState({activeIndex:2}); 
            setState({data:[]});
        }catch(error){
            
        }     
    }
 
    const FieldList = ({flist}) =>{
        const isAllSelected = flist.length > 0 && 
        state.selectedRowIds.length === flist.length;

        return ( 
            <table className="table" style={{width:'100%',fontSize:'12px'}}>
            <tbody>   
                <tr>
                    <td>
                         <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={(e) => handleSelectAll(e, state.flist)}
                            />
                    </td>
                    <td>Column</td>
                    <td>Type</td>
                </tr>
                {state.flist && state.flist.map((item,index)=>{ 
                    return( <tr key={index}> 
                        <td>
                            <input type="checkbox" checked={state.selectedRowIds.includes(item.name)}
                            onChange={(event) => handleCheckboxChange(event, item.name)} />
                        </td>
                        <td>{item.name}</td> 
                        <td>{item.type}</td> 
                    </tr>) 
                })} 
            </tbody>
            </table>
        );
    } 

    const handleSelectAll = (e, flist) => {
        if (e.target.checked) { 
            const allIds = flist.map(item => item.name); 
            setState({selectedRowIds:allIds});
        } else { 
            setState({selectedRowIds:[]});
        } 
        setState({data:[]}); 
        setState({activeIndex:2});
    };
   
    const handleCheckboxChange = (e, name) => {  
          const isChecked = e.target.checked; 
          setState(prev => {
            let updatedIds; 
            if (isChecked) { 
                updatedIds = prev.selectedRowIds.includes(name)
                    ? prev.selectedRowIds
                : [...prev.selectedRowIds, name];
            } else { 
                updatedIds = prev.selectedRowIds.filter(id => id !== name);
            }

            return {
                ...prev,
                selectedRowIds: updatedIds,
                data: [],
                activeIndex: 2
            };
        }); 
    };  
    
    const setPivote = (p)=>{ 
        setState((prev)=>({...prev,  ppivot: p})); 
         setGenChart(true); 
    };

    const saveWidgetMetadata = useCallback(() => {  
        setState((prev)=>({...prev, visible:true}));  
    }, []);  
 
    const [genchart, setGenChart] = useState(false);

    const fetchWidgetData = async () => {
        try { 
            const response =  await WidgetService.getWidgetData(id);   
          
            const jsondata = response.data[0]; 
            const prm = JSON.parse(jsondata.widgetparams);
            const prp = JSON.parse(jsondata.widgetprop);  
            const colresponse =  await DatasetService.getColumnList(jsondata.tblname);  
            const responseD =  await DatasetService.getDatasetList();  
            const dsname = responseD.data.filter((item)=>item.tblname===jsondata.tblname);  
        
            setState((prev)=>({...prev,  
                ppivot: prp.ppivot,
                widgettype: { 
                    wtype: jsondata.widgettype,
                    wname: jsondata.widgettypelabel, 
                    wnameshow:jsondata.widgettypelabel
                },
                modalInput:jsondata.widgetname,
                sourcename:dsname[0]?.Dataset, 
                sourcetbl:jsondata.tblname,
                selectedRowIds: prm.columns.split(","),
                setagg:prm.agg[0],
                setcolumn:prm.col[0],
                setaggof:prm.aggofcol[0],
                setsize:prm.size,
                setheme: prp.theme ,
                flist: colresponse.data,
                activeIndex:4,

                orderby:prm?.orderby, 
                settitlein:prp.settitlein,
                settitlepos:prp.settitlepos ,
                setlegendepos:prp.setlegendepos ,
                setlegendicon:prp.setlegendicon ,
                setlegendori:prp.setlegendori,
                setsplitbar:prp.setsplitbar 
     
            })); 
            
            setAllAgg(prm.allagg);
            setGenChart(true); 
             
        }catch(error){ 
            
        } 
    } 
     useEffect(() => {
        if(!genchart) return;
        generateReport(); 
        setGenChart(false); 
     },[genchart]);
 
    useEffect(() => { 
        if(isEdit) {  
            fetchWidgetData();  
        }
    }, [id, isEdit]);

    const handleAddWidget = async ()=>{ 

        var widnameinput =modalInputRef.current?.value; 
        setState({modalInput:widnameinput});
        const widgetdata = {
            widgetname:widnameinput,
            widgetparams:state.wparam, 
            widgetprop:state.wprop,  
            widgettype:state.widgettype.wtype, 
            widgettypelabel: state.widgettype.wnameshow,
            tblname:state.sourcetbl,
            id:id??"" 
        };  
        try {  
            if(id>0){
                await WidgetService.updateWidgetRecord(widgetdata);
            }else{
                await WidgetService.saveWidget(widgetdata);
            } 

         } catch (error) {
            handleError(error); 
        }finally{
             setState({visible:false});
        }  
    } 
     
    const containerRef = useRef(null);

    const handleUpdate = () => { 
         if (containerRef.current) {
            containerRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            });
        }
    };


    const generateReport = async ()=>{  
        if(state.selectedRowIds.length===0) return;      
        try {  

            var allagcol = []; 
            if (allagg) { 
               allagcol = allagg;
            } 

            var selectedColumn = columnRef.current?.value; 
            if (selectedColumn) { 
                setState((prev)=>({...prev,setcolumn:selectedColumn}));
            }

            var selectedAgg = aggregationRef.current?.value; 
            if (selectedAgg) {  
                setState((prev)=>({...prev,setagg:selectedAgg}));
            }

            var selectedAggOfColumn = aggregationOfRef.current?.value; 
            if (selectedAggOfColumn) { 
                setState((prev)=>({...prev,setaggof:selectedAggOfColumn}));
            }

            var selectedSize = sizeRef.current?.value; 
            if (selectedSize) { 
                setState((prev)=>({...prev,setsize:selectedSize}));
            }

            var selectedOrder = orderRef.current?.value; 
            if (selectedOrder) { 
                setState((prev)=>({...prev,orderby:selectedOrder}));
            } 

            const param = {
                tbl: state.sourcetbl, 
                columns: state.selectedRowIds.join(","),
                agg:[selectedAgg],
                col:[selectedColumn],
                aggofcol:[selectedAggOfColumn],
                size:selectedSize,
                widgettype:state.widgettype.wtype,
                allagg:allagg,
                orderby:selectedOrder
            }   
  
            var selectedPagination = paginationRef.current?.value; 
            if (selectedPagination) { 
                setState((prev)=>({...prev,setpg:selectedPagination}));
            }

            var selectedTheme =themeRef.current?.value; 
            if(selectedTheme){  
                setState((prev)=>({...prev,setheme:selectedTheme}));
            }  

            var inputTitle =titleinRef.current?.value; 
            if(inputTitle){  
                setState((prev)=>({...prev,settitlein:inputTitle}));
            }

            var titlePosition =titlePosRef.current?.value; 
            if(titlePosition){  
                setState((prev)=>({...prev,settitlepos:titlePosition}));
            }

            var legPosition =legendPosRef.current?.value; 
            if(legPosition){  
                setState((prev)=>({...prev,setlegendepos:legPosition}));
            }

            var legIcon =legendIconRef.current?.value; 
            if(legIcon){  
                setState((prev)=>({...prev,setlegendicon:legIcon}));
            }

            var legOri =legendOriRef.current?.value; 
            if(legOri){  
                setState((prev)=>({...prev,setlegendori:legOri}));
            }
              
            var splitBar =splitbarRef.current?.value; 
            if(splitBar){  
                setState((prev)=>({...prev,setsplitbar:splitBar}));
            }
            

            setState((prev)=>({...prev, wparam:{ 
                tbl: state.sourcetbl, 
                columns: state.selectedRowIds.join(","),
                agg:[selectedAgg],
                col:[selectedColumn],
                aggofcol:[selectedAggOfColumn],
                size:selectedSize,
                widgettype:state.widgettype.wtype,
                allagg:allagg,
                orderby:selectedOrder
            }})); 
             
            setState((prev)=>({...prev, wprop:{ 
                pagination: selectedPagination,
                theme:selectedTheme??'default',
                ppivot: state.ppivot,
                settitlein:inputTitle,
                settitlepos:titlePosition,
                setlegendepos:legPosition,
                setlegendicon:legIcon,
                setlegendori:legOri,
                setsplitbar:splitBar
            }})); 
             
            const response =  await DatasetService.getRecordByColumn(param);   
            setState((prev)=>({...prev,data:response.data})); 
            setState((prev)=>({...prev,reportflag:true}));

            setState((prev)=>({...prev,activeIndex:4}));  
            
        }catch(error){
            
        }finally{
             handleUpdate();
        } 
    } 
     
    const Accordion = ({dlist})=>{   
        return (
            <CAccordion activeItemKey={state.activeIndex}>
                <CAccordionItem itemKey={1} >
                    <CAccordionHeader>Select Datasource</CAccordionHeader>
                    <CAccordionBody style={{overflow:'auto',height:'200px'}}>  
                        <DatasourceList mlist={dlist} sourcetbl={state.sourcetbl} setDataset={setDataset} />   
                    </CAccordionBody>
                </CAccordionItem>

                <CAccordionItem itemKey={2}>
                    <CAccordionHeader >Select Fields</CAccordionHeader>
                    <CAccordionBody style={{overflow:'auto',height:'200px'}}>
                        <FieldList flist={state.flist} />
                         <div style={{width:'90%', margin:'10px'}}> 
                            <CButton className={`btn bg-${theme.color} btn-sm`} 
                            onClick={()=>setState({activeIndex:3})}
                            style={{marginBottom:'5px'}}>Next</CButton> 
                        </div>
                    </CAccordionBody>
                </CAccordionItem>
 

                <CAccordionItem itemKey={3}>
                    <CAccordionHeader>Select Parameter</CAccordionHeader>
                    <CAccordionBody style={{overflow:'auto',height:'200px'}}>
                        <ParameterList /> 
                        <div style={{width:'90%', margin:'10px'}}> 
                            <CButton className={`btn bg-${theme.color} btn-sm`}  
                            onClick={(e)=>{generateReport();}}
                            style={{marginBottom:'5px'}}>Apply</CButton> 
                        </div>
                    </CAccordionBody>
                </CAccordionItem>

                <CAccordionItem itemKey={4}>
                    <CAccordionHeader>Select Properties</CAccordionHeader>
                    <CAccordionBody ref={containerRef} style={{overflow:'auto',height:'200px'}}>
                        <PropertiesList /> 
                        <div style={{width:'90%', margin:'10px'}}> 
                            <CButton className={`btn bg-${theme.color} btn-sm`}  
                            style={{margin:'5px'}}
                            onClick={()=>handleWidgetClick()}>
                            {isEdit ? 'Add Widget' : 'Back'} 
                            </CButton>

                            <CButton className={`btn bg-${theme.color} btn-sm`}   
                            disabled={state.selectedRowIds?.length===0}
                            onClick={()=>{generateReport();}}
                            style={{margin:'5px'}}>Generate Report</CButton>  
                        </div>
                    </CAccordionBody>
                </CAccordionItem>
                
            </CAccordion>
        );
    }
    return (      
            <div className="p-0"> 

            <WidgetTabUi tabnoumber={1}  />    
            <div style={{padding:'5px'}}></div>  
            {!state.widgettype.wtype &&
                <div className="card" style={{height:'700px'}}>
                     
                    <div className={`card-header d-flex justify-content-between align-items-center 
                        text-white txt-${theme.color}`} style={{padding:'4px',backgroundColor:"#e1e1e1"}}>

                        <div style={{width:'90%',display: 'flex'}}> 
                            <div style={{ textAlign:'left', display:'inline-block', paddingLeft:'1%'}}>
                                <GridIcon size={18} /><strong> Select Widget Type</strong>   
                            </div>   
                        </div> 
                    </div> 
                
                    <div className="row">
                        <div className="col-lg-12"> 
                            <div className="p-3" style={{overflowY:'auto', overflowX:'hidden'}}>  
                                <div className="grid-stack" ref={gridRef} style={{ width: "100%" }}></div> 
                            </div> 
                        </div>
                    </div>

                </div>
            }     

            {state.widgettype.wtype && 
                <div className="dashboard-container">  
                    
                    <div className='card' style={{width:"25%"}}> 
                        
                         <div className={`card-header d-flex justify-content-between align-items-center 
                        text-white txt-${theme.color}`} style={{padding:'4px',backgroundColor:"#e1e1e1"}}>

                            <div style={{width:'90%',display: 'flex'}}> 
                                <div style={{ textAlign:'left', display:'inline-block', paddingLeft:'1%'}}>
                                    <GridIcon size={18} /><strong> Options</strong>   
                                </div>   
                            </div> 
                        </div>  

                        <div>
                            <Accordion dlist={state.listofdataset} />
                        </div>  
                    </div> 
        
                    <div className="card" style={{marginLeft:'5px',width:"75%"}}>   
                        
                            <div className={`card-header d-flex justify-content-between align-items-center 
                        text-white txt-${theme.color}`} style={{padding:'4px',backgroundColor:"#e1e1e1"}}>

                            <div style={{width:'30%',display: 'flex'}}> 
                                <div style={{ textAlign:'left', display:'inline-block', paddingLeft:'1%'}}>
                                    <GridIcon size={18} /><strong> {state.widgettype.wnameshow}</strong>   
                                </div>   
                            </div> 
                            <div style={{width:'60%',display: 'flex'}}>    
                                 <strong>Data Source ::</strong><i>{state.sourcename} </i>
                            </div>
                            <div style={{float:'right', cursor:'pointer'}} > 
                                <ArrowBigLeft size={18} onClick={()=>{handleWidgetClick()}} />

                                    {state.data?.length>0 &&
                                        <Save size={18} 
                                        onClick={()=>saveWidgetMetadata()} 
                                        style={{marginLeft:'10px'}} />     
                                    }
                            </div>

                        </div> 
                        <div className="row">
                            <div className="col-lg-12"> 
                                <div className="card-body p-3"> 
                                {(() => {
                                const SelectedWidget = widgetRegistry[state.widgettype.wtype];
                                return SelectedWidget ? (
                                    <SelectedWidget 
                                    data={state.data} 
                                    wprop={state.wprop} 
                                    wparam={state.wparam} 
                                    setPivote={setPivote}
                                    />
                                ) : (
                                    <div>Widget not found</div>
                                );
                                })()}

                                </div> 
                            </div> 
                        </div> 
                    </div>  
                </div>  
            }
  
            <CModal 
                scrollable 
                backdrop="static"
                visible={state.visible}
                onClose={(e) => setState({visible:false})}>
                <CModalHeader className={`btn btn-${theme.color}`} 
                    closeButton={false}
                    style={{padding: '5px 10px',  
                    borderBottomLeftRadius:'0px',
                    borderBottomRightRadius:'0px'}}>  
                    <CModalTitle style={{'fontSize': '1rem'}}>
                        {isEdit ? 'Edit Widget Name' : 'Add Widget Name'}
                            
                    </CModalTitle> 
                    <CButton onClick={(e) => setState({visible:false})} 
                        style={{padding:'0px', marginLeft:"65%" }}> 
                        <X style={{color:'#FFF',}} />
                    </CButton> 
                </CModalHeader> 
                <CModalBody>   
                    <input ref={modalInputRef} name="gname"
                    className="form-control" placeholder="Widget name"
                    defaultValue={state.modalInput}  />  
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={(e) => setState({visible:false})}>
                        Close
                    </CButton>
                    <CButton className={`btn btn-${theme.color}`} 
                                      
                        onClick={()=>handleAddWidget()}>Save
                    </CButton>
                </CModalFooter>
            </CModal>

            </div>                    
    );  
}
    
export default Widget;