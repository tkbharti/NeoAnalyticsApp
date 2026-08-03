import React, { useState, useEffect , useRef, useCallback} from "react";
import { useNavigate } from 'react-router-dom';
import { CButton,  CRow,  CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
	CTab, CTabContent, CTabList, CTabPanel, CTabs
 } from '@coreui/react';
   
import { useTheme } from '../../context/ThemeContext';
import {List ,FilePlus, Monitor,AreaChart } from 'lucide-react';

 const DashboardTabUi = ({tabnoumber, tablist, setTabIndex}) => {
    const { theme } 		= useTheme();
    const navigate = useNavigate();

    const handleWidgetClick = (id) => { 
        navigate('/dashboard/'+id);  
        setTabIndex(id);
    };
     
    
    return (
        <div> 
          
            <CTabs defaultActiveItemKey={tabnoumber} className="nav nav-tabs mb-2">
            <CTabList variant="underline-border" style={{fontWeight:'bold', fontSize:'12px'}} className="custom-tab-underline">
                 
                 { tablist?.map((item)=>{
                   return ( 
                        <CTab onClick={(e)=> {
                                if (tabnoumber === item.id) return; 
                                    handleWidgetClick(item.id);
                                }}
                        itemKey={item.id} 
                        key={item.id}
                        className={tabnoumber===item.id?`nav-link bg-${theme.color}`:`nav-link active  txt-${theme.color}`} 
                        style={{ padding: '5px 10px 5px 10px', color:'#FFF'}}>
                        <AreaChart size={15} /> {item.name}
                    </CTab>)  
                  })}
                
                 
                
            </CTabList> 
             
            </CTabs>
        </div>
        ); 
    } 

    export default DashboardTabUi;    