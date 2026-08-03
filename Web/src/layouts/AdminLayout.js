import React, { useState,  useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

import LoginPage from "../pages/Login/LoginPage";    
import Dashboard from "../pages/Dashboard/Dashboard";    
import JsonDataset from "../pages/Dataset/JsonDataset";
import CSVDataset from "../pages/Dataset/CSVDataset";  
import DatasetList from "../pages/Dataset/DatasetList";  


import Widget from "../pages/Widget/Widget"; 
import WidgetList from "../pages/Widget/WidgetList"; 

import Report from "../pages/Report/Report"; 
import ReportList from "../pages/Report/ReportList"; 
import EditReport from "../pages/Report/EditReport"; 

 
import Users from "../pages/Users/Users"; 


import Settings from "../pages/Settings/SettingsPage";  


import {UserService} from "../services/apiService";  

import PrivateRoute from "../route/PrivateRoute"; 

export default function AdminLayout({openMenu}) {
  const [collapsed, setCollapsed] = useState(true);
  const { theme } = useTheme();
  const sidebarWidth = collapsed ? 60 : 200;

  const navigate = useNavigate(); 
  
  const [permissions, setPermissions] = useState([]);
  const [name, setName] = useState("");
  const [udata, setUData] = useState({}) ;
  
  const [error, setError] = useState("");
  const handleError = async (error) =>{
    if (error.response) { 
      setError(error.response.data.message); 
    } else if (error.request) { 
      setError('Network Error:', error.request);
    } else { 
      setError('Unknown Error:', error.message);
    }
  }

  const logout = async (e) => { 
		localStorage.removeItem('token'); 
    localStorage.setItem('topnav','dashboard'); 
    localStorage.removeItem('subnav');  
		navigate('/'); 
	}
  
  const checkUser = useCallback(async () => { 
  try {
    const isAuthenticated = localStorage.getItem("token");
    if(isAuthenticated){
        const response = await UserService.checkToken(); 
        
        if(response.data.length>0){  
            if(!response.data[0].name){
              logout();
            }else{
              setName(response.data[0].name);
              let pageaccess = JSON.parse(response.data[0].permissions);
              setPermissions(pageaccess); 
              setUData(response.data[0]);
            } 
        }
    }
          
  } catch (error) {  
    handleError(error);	
  }
    
}, []); 
    
  useEffect( () => { 
    checkUser();   
  },[checkUser]);   


  return (
    <div className={`${theme.mode === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Header udata={udata} handleLogout={logout} />
   
      <Sidebar collapsed={collapsed} name={name} permissions={permissions} toggleSidebar={() => setCollapsed(!collapsed)} />

      <div
        className="d-flex flex-column"
        style={{
          marginTop: '40px',
          marginLeft: `${sidebarWidth}px`,
          minHeight: 'calc(100vh - 50px)',
          backgroundColor: '#fff',
          transition: 'margin-left 0.3s ease',
          overflowY: 'auto',
          height: 'calc(100vh - 50px)', 
        }}
      >
        <main className="flex-grow-1 p-3">
          <Routes>
            
            <Route path="/" element={<LoginPage />} />

            <Route path="/dashboard" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <Dashboard />
              }
              </PrivateRoute>
            }/> 

            <Route path="/dashboard/:id" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <Dashboard />
              }
              </PrivateRoute>
            }/> 

            <Route path="/jsondata" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <JsonDataset />
              }
              </PrivateRoute>
            }/> 

            <Route path="/csvjsonupload" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <CSVDataset />
              }
              </PrivateRoute>
            }/> 

            <Route path="/datasetlist" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <DatasetList />
              }
              </PrivateRoute>
            }/> 

            <Route path="/widget" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <Widget />
              }
              </PrivateRoute>
            }/>

            <Route path="/widget/:id" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <Widget />
              }
              </PrivateRoute>
            }/>  
             
            <Route path="/widgetlist" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <WidgetList />
              }
              </PrivateRoute>
            }/>


            <Route path="/report" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <Report />
              }
              </PrivateRoute>
            }/>

            <Route path="/editreport/:id" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <EditReport />
              }
              </PrivateRoute>
            }/> 

            <Route path="/reportlist" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <ReportList />
              }
              </PrivateRoute>
            }/>
                
                
            <Route path="/userlist" element=
            {
              <PrivateRoute> 
              { permissions && permissions.includes(1) &&
                <Users />
              }
              </PrivateRoute>
            }/> 
                  
             
              <Route path="/settings" element={<Settings />} />    
          </Routes>
        </main>
 
        <Footer/>
      </div>
    </div>
  );
}
