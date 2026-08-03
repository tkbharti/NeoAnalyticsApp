import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
 
import ReactECharts from "echarts-for-react"; 
import { ChartTheme } from "../Theme/ChartTheme";

const StackedLineWidget = ({ w, h, data, wprop, wparam }) => {  

    if(!data.length) return;
    ChartTheme() ; 
    const containerRef = useRef(null);
    const chartRef = useRef(null); 
    const col = wparam.aggofcol[0];
 
    const xAxis = [...new Set(data.map(d => d[col]))]; 
    
    const measureColumns = Object.keys(data[0]).filter(
        key => key !== col
    ); 

    const series = measureColumns.map(measure => ({
        name: measure,
        type: 'line',
        stack: 'Total', 
        data: xAxis.map(category => {
            const row = data.find(r => r[col] === category);
            return row ? row[measure] : 0;
        })
    }));

    wprop.setlegendepos = "top";
      
    var  option = {
 
        title: {
            show:true,
            top:25,
            text: wprop?.settitlein,
            textAlign:wprop?.settitlepos,
            textStyle:{ 
              color: '#15034e',        
              fontSize: 10
            }, 
          },
          tooltip:{
            show:true,
            trigger: 'axis',
            axisPointer:{
              type:'line',
              axis:'auto'
            }
          },
          toolbox: {
            show: true,
             padding: [5,40,5,10],
            feature: { 
              dataView: { readOnly: false },
              magicType: { type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          legend:{
            show:true,
            icon: wprop?.setlegendicon,
            left:'center',
            top: wprop?.setlegendepos,
            data: measureColumns,  
            type: 'scroll', 
            padding: [
                  70,   
                  25,  
                  45,   
                  10,  
              ]
          }, 
          grid : {
            left: 50,
            right: 50,
            top: wprop?.setlegendepos==='top'?100:70,
            bottom: 110
          },              
          xAxis: { 
            show: true,
            type: "category",
            data: xAxis,
            name: wparam?.col?.[0],
            position:'bottom',
            nameGap:30,
            nameLocation:'center',
            boundaryGap: false, 
          },
          yAxis: {
            show: true,
            type: "value",
            name: wparam?.aggofcol?.[0],
            position:'left'
          },
          series:  series 
         };    

         const [themename,setThemeName] = useState("");
    
        useEffect(() => {    
            setThemeName(wprop.theme);
        }, [wprop.theme]); 
         useEffect(() => {
                if (!containerRef.current) return;
        
                const observer = new ResizeObserver(() => {
                  const instance = chartRef.current?.getEchartsInstance();
                  instance?.resize({
                    width: 'auto',
                    height: 'auto',
                  });
                });
        
                observer.observe(containerRef.current);
        
                return () => observer.disconnect();
            }, []);
        
            return (
                <div ref={containerRef} style={{width:"100%", height:'100%'}}>
                 {(() => { 
                  return data?.length>0 ? (
                            <ReactECharts 
                            ref={chartRef}
                            key={themename}
                            theme={themename}
                            option={option} 
                            style={{ width: w?w:'100%', height: h?h:'350px' }} />
                  ) : (
                      <div></div>
                  );
                  })()} 
                </div>  
        
                
          ); 
           
        };
        
export default StackedLineWidget;