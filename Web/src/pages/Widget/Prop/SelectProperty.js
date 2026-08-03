import React, { useState, useRef } from "react";
import {
  CFormInput,  
  CFormSelect,  
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton
} from '@coreui/react';

import { GetThemeNames } from "../Theme/ThemeRegistry";

export const PaginationSelector = ({ paginationRef, setpg }) => { 
    return ( 
          <CFormSelect 
            className="mb-1"   
            style={{float:'left'}} 
            ref={paginationRef} 
            defaultValue={setpg} 
            size="sm"> 
            <option value="local">Yes</option>
            <option value="no">No</option>
        </CFormSelect> 
    );  
};

export const ThemeSelector = ({ themeRef,setheme }) => {
  const themes = GetThemeNames();
    return ( 
        <CFormSelect 
            className="mb-1"   
            style={{float:'left'}}  
            ref={themeRef}
            defaultValue={setheme}  
            size="sm"> 
            {themes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
        </CFormSelect> 
    );  
};

export const TitleInput = ({ titleinRef,settitlein }) => {  
    return ( 
        <CFormInput 
            type="text"
            className="mb-1"   
            style={{ float: 'left'}}  
            ref={titleinRef} 
            defaultValue={settitlein}  
            size="sm"
        />
    );  
};

export const TitlePosition = ({ titlePosRef,settitlepos }) => {
    const titlepos=['center','left','right'];
    return ( 
        <CFormSelect className="mb-1"   
            style={{float:'left'}}  
            ref={titlePosRef}
            defaultValue={settitlepos}  
            size="sm">  
            {titlepos.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))} 
        </CFormSelect> 
    );  
};

export const LegendPosition = ({ legendPosRef,setlegendepos }) => {
    const legpos=['top','bottom','left','right', 'center'];
    return ( 
        <CFormSelect className="mb-1"   
            style={{float:'left'}}  
            ref={legendPosRef}
            defaultValue={setlegendepos}  
            size="sm">  
            {legpos.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
            ))} 
        </CFormSelect> 
    );  
};

export const LegendIcon = ({ legendIconRef,setlegendicon }) => {
    const legendicon=[
                    {text:"Default", label:""}, 
                    {text:"Arrow", label:"arrow"}, 
                    {text:"Pin", label:"pin"}, 
                    {text:"Triangle", label:"triangle"}, 
                    {text:"Round Rectangle", label:"roundRect"}, 
                    {text:"Rectangle", label:"rect"}, 
                    {text:"Diamond", label:"diamond"}, 
                ];
    return ( 
        <CFormSelect className="mb-1"   
            style={{float:'left'}}  
            ref={legendIconRef}
            defaultValue={setlegendicon}  
            size="sm">  
            {legendicon.map((t,index) => (
              <option key={index} value={t.label}>{t.text}</option>
            ))} 
        </CFormSelect> 
    );  
};
 
export const LegendOrientation = ({ legendOriRef,setlegendori }) => {
    const legori=['vertical', 'horizontal'];
    return ( 
        <CFormSelect className="mb-1"   
            style={{float:'left'}}  
            ref={legendOriRef}
            defaultValue={setlegendori}  
            size="sm">  
            {legori.map((t,index) => (
              <option key={index} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
            ))} 
        </CFormSelect> 
    );  
};

export const SplitBar = ({ splitbarRef,setsplitbar }) => {
    const splitbar=['no', 'yes'];
    return ( 
        <CFormSelect className="mb-1"   
            style={{float:'left'}}  
            ref={splitbarRef}
            defaultValue={setsplitbar}  
            size="sm">  
            {splitbar.map((t,index) => (
              <option key={index} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
            ))} 
        </CFormSelect> 
    );  
};