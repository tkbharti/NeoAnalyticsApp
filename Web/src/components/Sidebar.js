 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown, Settings, Database , AreaChart, Users, Home, FolderCog , LucideMonitorCheck , ArrowRight , ArrowLeft, Monitor, MonitorPlay, SendToBack, Combine    } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { px } from 'framer-motion';

export default function Sidebar({ collapsed, toggleSidebar, permissions, name }) {
  const [openMenu, setOpenMenu] = useState(null);
  const { theme } = useTheme();
  const toggleSubmenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
  
  const styles = {
    dashboardGradient: {
      backgroundImage: `linear-gradient(45deg, black, transparent)`,
        },
      
    noGradient: {}
  } 
   const [bgnav, setBg] = useState(''); 

   const [subnav, setNav] = useState('');  

  const setTop = (nav)=>{
    setBg(nav);
    setNav('');
    localStorage.setItem('topnav',nav); 
    localStorage.removeItem('subnav'); 
  }
  
  const setSub = (nav)=>{ 
      setNav(nav);
      localStorage.setItem('subnav',nav); 
  }
 
  useEffect( () => { 
    setBg(localStorage.getItem('topnav'));
    setNav(localStorage.getItem('subnav'));  
  },[bgnav,subnav]);   
 
  return (
    <aside
      className={`position-fixed bg-${theme.color} text-white`}
      style={{
        backgroundColor:`${theme.color}`,
        top: '35px',
        bottom: 0,
        left: 0,
        width: collapsed ? '60px' : '200px',
        overflowY: 'auto', 
        zIndex: 1000, 
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-2 border-bottom border-light">
        {!collapsed && <strong style={{marginTop:'5px'}}>{name}</strong>}
        <button className="btn btn-sm" 
        style={{color:"#FFF",'paddingLeft':'14px',border:'0px',}} 
        onClick={toggleSidebar}>
          <Menu size={16} />
        </button>
      </div>

      <nav className="nav flex-column mt-2">

      { permissions && permissions.includes(1) &&   
      <Link to="/dashboard" className="nav-link text-white d-flex align-items-center" 
        onClick={()=>{setTop('dashboard');}}
         style={
              bgnav === 'dashboard'
                ? styles.dashboardGradient
                : styles.noGradient
            }
        >
        <Monitor  size={24} color={bgnav === 'dashboard'?'#15A5FF':'#FFF'} /> {!collapsed && <span className="ms-2">Dashboard</span>}  
      </Link> 
      }

     { permissions && permissions.includes(1) &&   
      <Link to="/datasetlist" className="nav-link text-white d-flex align-items-center" 
        onClick={()=>{setTop('datasetlist');}}
         style={
              bgnav === 'datasetlist'
                ? styles.dashboardGradient
                : styles.noGradient
            }
        >
        <Database  size={24} color={bgnav === 'datasetlist'?'#15A5FF':'#FFF'} /> {!collapsed && <span className="ms-2">Dataset</span>}  
      </Link> 
      }

      { permissions && permissions.includes(1) &&   
      <Link to="/widget" className="nav-link text-white d-flex align-items-center" 
        onClick={()=>{setTop('widget');}}
         style={
              bgnav === 'widget'
                ? styles.dashboardGradient
                : styles.noGradient
            }
        >
        <Combine  size={24} color={bgnav === 'widget'?'#15A5FF':'#FFF'} /> {!collapsed && <span className="ms-2">Widget</span>}  
      </Link>  
      }  

      { permissions && permissions.includes(1) &&   
      <Link to="/report" className="nav-link text-white d-flex align-items-center" 
        onClick={()=>{setTop('report');}}
         style={
              bgnav === 'report'
                ? styles.dashboardGradient
                : styles.noGradient
            }
        >
        <AreaChart size={24} color={bgnav === 'report'?'#15A5FF':'#FFF'} /> {!collapsed && <span className="ms-2">Report</span>}  
      </Link>  
      }  

      {/* permissions && permissions.includes(1) &&   
      <Link to="/users" className="nav-link text-white d-flex align-items-center" 
        onClick={()=>{setTop('users');}}
         style={
              bgnav === 'users'
                ? styles.dashboardGradient
                : styles.noGradient
            }
        >
        <Users  size={24} color={bgnav === 'users'?'#15A5FF':'#FFF'} /> {!collapsed && <span className="ms-2">Users</span>}  
      </Link>  
      */}  


      <Link to="/settings" className="nav-link text-white d-flex align-items-center" 
        onClick={()=>{setTop('settings');}}
         style={
              bgnav === 'settings'
                ? styles.dashboardGradient
                : styles.noGradient
            }
        >
        <Settings  size={24} color={bgnav === 'settings'?'#15A5FF':'#FFF'} /> {!collapsed && <span className="ms-2">Settings</span>}  
      </Link>  
         
      </nav>
    </aside>
  );
}
