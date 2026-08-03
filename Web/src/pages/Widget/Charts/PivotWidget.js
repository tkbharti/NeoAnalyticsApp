import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import PivotTable from "react-pivottable/PivotTable";
import "react-pivottable/pivottable.css";

const PivotWidget = ({ w, h, data, wprop, setPivote, report }) => {
  const [state, setState] = useState({
    rows: [],
    cols: [],
    aggregatorName: "Count",
    rendererName: "Table",  
  });  
  
  const handleChange = (s) => {
    delete s.aggregators;
    delete s.data;
    delete s.localeStrings;
    delete s.renderers; 
    setState(s);
    setPivote(s);
  };

  useEffect(()=>{
      if(!wprop.ppivot) return; 
        setTimeout(()=>{  
           setState((prev)=>({...wprop.ppivot}));
        },200);
      
  },[wprop.ppivot]);

  return ( 
    <div> 
     
     {(() => { 
      return data?.length>0 ? (
         report?( 
            <PivotTable
            data={data}
            onChange={handleChange} 
            {...state}
            style={{ width: w?w:'101%', height: h?h:'350px' }}
          />
          ):(
            <PivotTableUI
            data={data}
            onChange={handleChange} 
            {...state}
            style={{ width: w?w:'101%', height: h?h:'350px' }}
          />
        )  
       
      ) : (
          <div></div>
      );
      })()} 
    </div>  
  ); 
};

export default PivotWidget;