import "./Header.css";
import logo from "./headerLogo.png";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { IconButton } from "@material-ui/core";

const Header = () => {
  return (
    <div id="siteHeader">
      <div id="headerTop">
        <img src={logo} id="headerLogo" alt="NDSU" />

        <IconButton id="accountIcon">
          <AccountCircleIcon fontSize="large" />
        </IconButton>
      </div>
      <div id="headerBottom">Upper Great Plains Transportation Institute</div>
    </div>
  );
};

export default Header;
