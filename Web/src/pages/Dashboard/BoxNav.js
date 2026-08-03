import React ,{useState} from 'react';  
import { Link } from 'react-router-dom';
import { Menu, ChevronDown, Settings, Database , AreaChart, Users, Home, FolderCog , LucideMonitorCheck , ArrowRight , ArrowLeft, Monitor, MonitorPlay, SendToBack, Combine    } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

import './BoxNav.css';

const BoxNav = () => { 
    const { theme } = useTheme(); 
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

    return (
       <div className='row'> 

            <div className='col-4'>  
                <div className="boxnav">   
                    <Link to="/datasetlist"
                     onClick={()=>{setTop('datasetlist');}}
                     className={`bn-content btn-${theme.color}`}><Database /> Dataset</Link> 
                </div>    
            </div>  

            <div className='col-4'>     
            <div className="boxnav">   
                    <Link to="/widget" 
                     onClick={()=>{setTop('widget');}}
                     className={`bn-content btn-${theme.color}`}><Combine /> Widget</Link> 
            </div>
            </div>

             <div className='col-4'>   
                    <div className="boxnav">   
                        <Link to="/reportlist"
                        onClick={()=>{setTop('report');}}
                        className={`bn-content  btn-${theme.color}`}><AreaChart /> Report</Link>
                    </div>
                 
            </div>
        </div> 
    ); 
}

export default BoxNav;