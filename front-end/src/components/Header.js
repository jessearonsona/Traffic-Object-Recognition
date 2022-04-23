import "../styling/Header.css";
import logo from "../assets/headerLogo.png";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { IconButton, Paper } from "@material-ui/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = (props) => {
  const showAdminOption = () => {
    if (props.admin === "true") {
      return true;
    } else {
      return false;
    }
  };

  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    setAccessToken(localStorage.getItem("token"));
  }, [accessToken]);

  const navigate = useNavigate();

  // Get current page to use for conditional rendering
  const location = useLocation();
  const pathname = location.pathname;

  // used for conditional rendering of user icon
  const isLoginPage = (path) => {
    return path === "/";
  };

  const handleAdminRedirect = () => {
    if (accessToken) {
      navigate("/admin");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <div id="siteHeader">
      <div id="headerTop">
        <img src={logo} id="headerLogo" alt="NDSU" />
        <div id="headerBottom">
          Upper Great Plains Transportation Institute
          {!isLoginPage(pathname) && (
            <div className="dropdown">
              <div className="move_right">
                <IconButton id="accountIcon" className="dropbtn">
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
              </div>
              <div className="dropdown-content">
                {showAdminOption() && (
                  <a onClick={() => handleAdminRedirect()}> Admin Page </a>
                )}
                <a href="http://localhost:3000" onClick={handleLogout}>
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
