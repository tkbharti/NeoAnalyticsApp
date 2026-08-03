import React, { useState, useEffect , useRef, useCallback} from "react";
import { useNavigate } from 'react-router-dom';
import { CButton,  CRow,  CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
	CTab, CTabContent, CTabList, CTabPanel, CTabs
 } from '@coreui/react';
   
import { useTheme } from '../../context/ThemeContext';
import {List ,FilePlus } from 'lucide-react';

 const WidgetTabUi = ({tabnoumber, setState}) => {
    const { theme } 		= useTheme();
    const navigate = useNavigate();

    const handleWidgetClick = () => { 
        navigate('/widget');  
    };
    
    const handleWidgetListClick = () => { 
        navigate('/widgetlist');  
    };  
    
    return (
        <div> 
            
            <CTabs defaultActiveItemKey={tabnoumber} className="nav nav-tabs mb-2">
            <CTabList variant="underline-border" style={{fontWeight:'bold', fontSize:'12px'}} className="custom-tab-underline">
                <CTab onClick={(e)=> {
                    if (tabnoumber === 1) return; 
                        handleWidgetClick(e);
                    }
                } itemKey={1} 
                  className={tabnoumber===1?`nav-link bg-${theme.color}`:`nav-link active  txt-${theme.color}`} 
                  style={{ padding: '5px 10px 5px 10px', color:'#FFF'}}>
                    <FilePlus size={15} /> Create Widget
                </CTab>   
               
                <CTab onClick={(e)=> {
                    if (tabnoumber === 2) return; 
                        handleWidgetListClick(e);
                    }} itemKey={2} 
              
                className={tabnoumber===2?`nav-link bg-${theme.color}`:`nav-link active  txt-${theme.color}`} 
                  style={{ padding: '5px 10px 5px 10px', color:'#FFF'}}>
                    <List size={15} /> Widget List
                </CTab> 
                
            </CTabList> 
             
            </CTabs>
        </div>
        ); 
    } 

    export default WidgetTabUi;    