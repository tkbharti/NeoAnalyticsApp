import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
 
import ReactECharts from "echarts-for-react"; 
import { ChartTheme } from "../Theme/ChartTheme";

const SimpleLineWidget = ({w, h, data, wprop, wparam }) => {  
    
    ChartTheme() ; 
    const containerRef = useRef(null);
    const chartRef = useRef(null); 
   
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
             type: 'scroll', 
             padding: [
                  50,   
                  25,  
                  45,   
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
            data: data.map(d => d.name),
            name: wparam?.col?.[0],
            position:'bottom',
            nameGap:30,
            nameLocation:'center' 
          },
          yAxis: {
            show: true,
            type: "value",
            name: wparam?.aggofcol?.[0],
            position:'left'
          }, 
          series: [
            {
              type: "line", 
              data: data.map(d => d.value), 
              name: wparam?.col?.[0],
              label: {
                show: true,
                position: 'top',
                valueAnimation: true
              }
            }
          ]
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

export default SimpleLineWidget;