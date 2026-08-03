import React,{useState, useEffect, useRef, useCallback, memo  } from 'react'; 
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CButton } from '@coreui/react';

import {
  CFormSelect,   
} from '@coreui/react'; 

import {
    AggregationSelector, 
    AggregationColumn, 
    AggregationOf, 

    SizeSelector,
    OrderSelector,

    AddedFieldList,
 
} from "./Param/SelectParameter";


import {
    PaginationSelector,
    ThemeSelector,
    TitleInput,
    TitlePosition,
    LegendPosition,
    LegendIcon,
    LegendOrientation,
    SplitBar
} from "./Prop/SelectProperty"; 

const DatasourceList =  ({mlist, sourcetbl, setDataset}) =>{ 
        return ( 
            <table className="table" style={{width:'100%', fontSize:'12px'}}>
            <tbody>    
                {mlist?.length>0 &&   
                    mlist.map((item,index)=>{ 
                       return( <tr key={index}>
                        <td style={{
                            cursor:'pointer',
                            textAlign:'left', 
                            fontWeight:sourcetbl===item.tblname?"bold":"normal",
                            color:sourcetbl===item.tblname?"blue":'#000'
                        }} 
                        onClick={()=>setDataset(item)}>{item.Dataset}</td>
                        </tr>) 
                    })
                }  
            </tbody>
            </table>  
        );
} 

const DataTableParam = ({sizeRef, setsize})=>{
        return (  
            <div style={{width:'90%', margin:'10px'}}> 
                 <div className='row'>
                    <div className='col-12'>
                        <label style={{float:'left', paddingTop:'2px'}} id="size" htmlFor='saggcol'>Record Size</label>
                    </div>
                    <div className='col-12'>
                        <SizeSelector sizeRef={sizeRef}  setsize={setsize} />  
                    </div>
                </div> 
            </div>  
        );
}

const SimpleChartParam = ({ 
        widgettype,  
        fieldlist, 
        columnRef, 
        setcolumn, 
        setagg, 
        aggregationRef, 
        aggregationOfRef, 
        setaggof, 
        sizeRef, 
        setsize,
        orderRef, 
        orderby
        })=>{
 
        return (   
            <div style={{width:'90%', margin:'10px'}}>  
                 <div className='row'>
                    <div className='col-12'>
                         <label style={{float:'left', paddingTop:'2px'}} htmlFor='saggcol'>Column</label>   
                    </div>
                    <div className='col-12'>
                        <AggregationColumn fieldlist={fieldlist} columnRef={columnRef} setcolumn={setcolumn}  />     
                    </div>

                    <div className='col-12'>
                        <label style={{float:'left', paddingTop:'2px'}} htmlFor='sagg'>Aggregation</label>     
                    </div>

                    <div className='col-12'> 
                        <AggregationSelector aggregationRef={aggregationRef}  setagg={setagg} />   
                    </div>

                    <div className='col-12'>
                        <label style={{float:'left', paddingTop:'2px'}} htmlFor='saggof'>Aggregation Of</label>       
                    </div> 

                    <div className='col-12'> 
                        <AggregationOf fieldlist={fieldlist} aggregationOfRef={aggregationOfRef} setaggof={setaggof}  /> 
                    </div>

                    <div className='col-12'>
                         <label style={{float:'left', paddingTop:'2px'}} htmlFor='size'>Record Size</label>   
                    </div>

                    <div className='col-12'>
                         <SizeSelector sizeRef={sizeRef}  setsize={setsize} />   
                    </div>

                    <div className='col-12'>
                         <label style={{float:'left', paddingTop:'2px'}} htmlFor='size'>Order By</label> 
                    </div>

                    <div className='col-12'>
                         <OrderSelector orderRef={orderRef}  orderby={orderby} />    
                    </div>
                </div> 
            </div> 
        );
} 

const StackedChartParam = ({
        widgettype, 
        fieldlist, 
        columnRef, 
        setcolumn,
        aggregationRef,
        setagg,
        aggregationOfRef,
        setaggof,
        allagg,
        setAllAgg
    })=>{  

        const [isPinned, setIsPinned] = useState(false);

        const addItem = (newItem) => {
            setAllAgg((prevItems) => { 
                const isDuplicate = prevItems.some(
                    (item) => item.agg === newItem.agg && item.aggof === newItem.aggof
                );

                if (isDuplicate) return prevItems;  
                return [...prevItems, newItem]; 
            });
            handleClick();
        };

        const collectdata= (e)=>{ 
            e.preventDefault();
            addItem({
                "agg": aggregationRef.current.value,
                "aggof": aggregationOfRef.current.value
            }); 
        }

        const setId = (indexToRemove)=>{
            setAllAgg((prevItems) => 
             prevItems.filter((_, index) => index !== indexToRemove)
            );
            setIsPinned(true);
        } 

         const handleClick = () => {
             setIsPinned(true);
        }
        
        return (  
            <div style={{width:'90%', margin:'10px'}}>
                <div className='row'>
                        <div className='col-12'>
                            {widgettype.wtype==='horisontalstackedbar' &&  
                             <label style={{float:'left', fontWeight:"bold", paddingTop:'2px'}}>Y-Axis</label> 
                            }
                            {widgettype.wtyp!=='horisontalstackedbar' &&  
                             <label style={{float:'left', fontWeight:"bold", paddingTop:'2px'}}>X-Axis</label> 
                            }
                        </div>
                        <div className='col-12'>
                             <AggregationColumn fieldlist={fieldlist} columnRef={columnRef} setcolumn={setcolumn}  />   
                        </div>

                        <div className='col-12'>
                            {widgettype.wtype==='horisontalstackedbar' &&  
                             <label style={{float:'left', fontWeight:"bold",  paddingTop:'2px'}}>X-Axis</label> 
                            }
                            {widgettype.wtype!=='horisontalstackedbar' &&  
                             <label style={{float:'left', fontWeight:"bold",  paddingTop:'2px'}}>Y-Axis</label> 
                            }
                        </div>

                        <div className='col-12'>
                             <label style={{float:'left', paddingTop:'2px'}}>Aggregation</label> 
                        </div>
                        <div className='col-12'>
                              <AggregationSelector aggregationRef={aggregationRef}  setagg={setagg} /> 
                        </div>

                         <div className='col-12'>
                              <label style={{float:'left', paddingTop:'2px'}}>Aggregation Of</label> 
                        </div>

                        <div className='col-12'>
                             <AggregationOf fieldlist={fieldlist} aggregationOfRef={aggregationOfRef} setaggof={setaggof}  /> 
                        </div>
                         <div className='col-12'> 
                             <CButton className={`btn btn bg-default btn-sm`}    
                                onClick={(e)=>collectdata(e)}
                                style={{margin:'5px',float:'right',textAlign:'left', paddingTop:'2px'}}>Add</CButton>   
                        </div>
                </div> 
                 
                 <div className='row' style={isPinned ? { position: "absolute", bottom: 0, left: 0, right: 0 } : {}}>
                    <div className='col-12'>
                        {allagg?.length>0 && (
                            <div >  
                                <AddedFieldList allagg={allagg} setId={setId} />   
                            </div>
                        )}  
                    </div> 
               </div>
                    
                    
            </div> 
        );
} 

const DataTableProp = ({paginationRef,setpg})=>{  
    return ( 
            <CAccordion activeItemKey={1} style={{}}>
                <CAccordionItem itemKey={1} >
                    <CAccordionHeader className="custom-header">Miscellaneous</CAccordionHeader>
                    <CAccordionBody style={{overflow:'auto',minHeight:'100px'}}>   
                        <div style={{width:'90%', margin:'10px'}}>  
                            <div className='row'>
                                <div className='col-12'>
                                    <label style={{float:'left', paddingTop:'2px'}}>Show Pagination</label>   
                                </div>
                                <div className='col-12'>
                                <PaginationSelector paginationRef={paginationRef}  setpg={setpg}  />       
                                </div> 
                            </div>
                        </div>
                    </CAccordionBody>
                </CAccordionItem>
            </CAccordion> 
    );
} 

const SimpleBarProp = ({
    widgettype,
    themeRef, 
    setheme, 
    titleinRef, 
    settitlein, 
    titlePosRef, 
    settitlepos,
    legendPosRef,
    setlegendepos,
    legendIconRef,
    setlegendicon,
    legendOriRef,
    setlegendori,
    splitbarRef,
    setsplitbar
    })=>{ 
    return (  
        <div style={{width:'90%', margin:'10px'}}>
          
            <div className='row'>
                <div className='col-12'>
                    <label style={{float:'left', fontWeight:'bold'}}>Theme</label>      
                </div>
                <div className='col-12'>
                    <ThemeSelector themeRef={themeRef} setheme={setheme} /> 
                </div>  

                <div className='col-12'>
                    <label style={{float:'left', fontWeight:'bold'}}>Title Text</label>      
                </div>
                <div className='col-12'>
                   <TitleInput titleinRef={titleinRef} settitlein={settitlein} /> 
                </div> 

                <div className='col-12'>
                    <label style={{float:'left', fontWeight:'bold'}}>Title Position</label>      
                </div>
                <div className='col-12'>
                    <TitlePosition titlePosRef={titlePosRef} settitlepos={settitlepos} /> 
                </div> 

                 <div className='col-12'>
                    <label style={{float:'left', fontWeight:'bold'}}>Legend Position</label>      
                </div>
                <div className='col-12'>
                    <LegendPosition legendPosRef={legendPosRef} setlegendepos={setlegendepos} /> 
                </div>

                <div className='col-12'>
                    <label style={{float:'left', fontWeight:'bold'}}>Legend Icon</label>      
                </div>
                <div className='col-12'>
                    <LegendIcon legendIconRef={legendIconRef} setlegendicon={setlegendicon} /> 
                </div>

                <div className='col-12'>
                    <label style={{float:'left', fontWeight:'bold'}}>Legend Orientation</label>      
                </div>
                <div className='col-12'>
                    <LegendOrientation legendOriRef={legendOriRef} setlegendori={setlegendori} /> 
                </div>

                <div className='col-12'>
                    <label style={{float:'left', fontWeight:'bold'}}>Split Bar</label>      
                </div>
                <div className='col-12'>
                    <SplitBar splitbarRef={splitbarRef} setsplitbar={setsplitbar} /> 
                </div>
                 
            </div>
        </div> 
        
    );
} 

export {
        DatasourceList, 

        DataTableParam,
        
        SimpleChartParam, 
        StackedChartParam, 
       
        DataTableProp,  
        SimpleBarProp,   
        
};