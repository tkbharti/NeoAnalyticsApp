import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'tabulator-tables/dist/css/tabulator.min.css'; 
import 'tabulator-tables/dist/css/tabulator_simple.min.css'; 

Tabulator.registerModule([]); 

const TableWidget = ({ w, h, data , wprop }) => {
 
  const datasetTableRef 	= useRef(null); 
  
  useEffect(() => { 
           
          if(data.length==0) return;
          if (!datasetTableRef.current) return; 
              const timeout = setTimeout(() => {  
                    
                    const datasetcolumn = Object.keys(data[0]) 
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

                  const tableInstance = new Tabulator(datasetTableRef.current, { 
                      data: data,
                     // reactiveData: true, 
                      height: "340px",
                      verticalFillMode: "fill", 
                      pagination: wprop.pagination==='local'??"",
                      paginationSize: 10,
                      layout: "fitColumns",
                      placeholder: "Loading...",  
                      paginationSizeSelector:[5, 10, 25, 50,100],
                      movableColumns:true,
                      paginationCounter:"rows", 
                      columns: datasetcolumn 
                  });  
              }, 100);  
  
              return () => {
                  clearTimeout(timeout);   
              }
  
      }, [data]);

  return (

      <div ref={datasetTableRef}></div> 
  );
    
};

export default TableWidget;