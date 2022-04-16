import "./Header.css";
import logo from "./headerLogo.png";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {IconButton, Paper} from '@material-ui/core'
import { useState } from "react";



const Header = () => {
  const [isAdmin, setIsAdmin]=useState(false);
  return (
    <div id="siteHeader">
        <div id="headerTop">        
            <img src={logo} id="headerLogo" alt="NDSU" />
            <div id="headerBottom">
            Upper Great Plains Transportation Institute
            <div className="dropdown">
              <div className="move_right">
              <IconButton id="accountIcon" className="dropbtn"> 
                <AccountCircleIcon fontSize= "large"/> 
              </IconButton> 
              </div>
              <div class="dropdown-content">
                 
                {isAdmin && (<a href="http://localhost:3000/Admin">Admin Page</a>)}
                <a href="http://localhost:3000">Logout</a>
              </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default Header;