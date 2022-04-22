import "../styling/Header.css";
import logo from "../assets/headerLogo.png";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { IconButton, Paper } from "@material-ui/core";
import { useLocation } from "react-router-dom";

const Header = (props) => {
  const showAdminOption = () => {
    if (props.admin === "true") {
      return true;
    } else {
      return false;
    }
  };

  // Get current page to use for conditional rendering
  const location = useLocation();
  const pathname = location.pathname;

  // used for conditional rendering of user icon
  const isLoginPage = (path) => {
    return path === "/";
  };

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <div id="siteHeader">
      <div id="headerTop">
        <img src={logo} id="headerLogo" alt="NDSU" />
        {!isLoginPage(pathname) && (
          <div class="dropdown">
            <IconButton id="accountIcon" class="dropbtn">
              <AccountCircleIcon fontSize="large" />
            </IconButton>
            <div class="dropdown-content">
              {showAdminOption() && (
                <a href="http://localhost:3000/admin">Admin Page</a>
              )}
              <a href="http://localhost:3000" onClick={handleLogout}>
                Logout
              </a>
            </div>
          </div>
        )}
      </div>
      <div id="headerBottom">Upper Great Plains Transportation Institute</div>
    </div>
  );
};

export default Header;
