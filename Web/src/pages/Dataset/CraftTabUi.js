import React, { useState, useEffect , useRef, useCallback} from "react";
import { useNavigate } from 'react-router-dom';
import { CButton,  CRow,  CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
	CTab, CTabContent, CTabList, CTabPanel, CTabs
 } from '@coreui/react';
   
import { useTheme } from '../../context/ThemeContext';
import {List ,FileInput, Upload, ClipboardPaste} from 'lucide-react';

 const CraftTabUi = ({tabnoumber}) => {
    const { theme } 		= useTheme();
    const navigate = useNavigate();

    const handleJsonClick = () => {
        navigate('/jsondata');  
    };
    
    const handleUploadClick = () => {
        navigate('/csvjsonupload');  
    }; 

    const handleListClick = () => {
        navigate('/datasetlist');  
    }; 
    
    return (
        <div>

            
            <CTabs defaultActiveItemKey={tabnoumber} className="nav nav-tabs mb-2">
            <CTabList variant="underline-border" style={{fontWeight:'bold', fontSize:'12px'}} className="custom-tab-underline">
                <CTab onClick={handleListClick} itemKey={3} 
                  className={tabnoumber===3?`nav-link bg-${theme.color}`:`nav-link active  txt-${theme.color}`} 
                  style={{ padding: '5px 10px 5px 10px', color:'#FFF'}}>
                    <List size={15} /> Dataset List 
                </CTab>  
                
                <CTab onClick={handleUploadClick} itemKey={2} 
                className={tabnoumber===2?`nav-link bg-${theme.color}`:`nav-link active  txt-${theme.color}`} 
                  style={{ padding: '5px 10px 5px 10px', color:'#FFF'}}>
                    <FileInput size={15} /> Upload CSV/JSON File
                </CTab>

                <CTab onClick={handleJsonClick} itemKey={1} 
                className={tabnoumber===1?`nav-link bg-${theme.color}`:`nav-link active  txt-${theme.color}`} 
                  style={{ padding: '5px 10px 5px 10px', color:'#FFF'}}>
                    <ClipboardPaste size={15} />Paste JSON Data
                </CTab>
                
            </CTabList> 
             
            </CTabs>
        </div>
        ); 
    } 

    export default CraftTabUi;    