import "./Header.css";
import logo from "./headerLogo.png";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {IconButton, Paper} from '@material-ui/core'
import Grid from '@mui/material/Grid';
import {styled} from '@material-ui/styles';


const Header = () => {
  return (
    <div id="siteHeader">
        <div id="headerTop">        
            <img src={logo} id="headerLogo" alt="NDSU" />
            <div id="headerBottom">
            Upper Great Plains Transportation Institute
            <div class="dropdown">
              <div className="move_right">
              <IconButton id="accountIcon" class="dropbtn"> 
                <AccountCircleIcon fontSize= "large"/> 
              </IconButton> 
              </div>
              <div class="dropdown-content">
                <a href="http://localhost:3000/Account">My account</a>
                <a href="http://localhost:3000">Logout</a>
              </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default Header;