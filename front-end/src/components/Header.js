import "./Header.css";
import logo from "./headerLogo.png";

const Header = () => {
  return (
    <div id="siteHeader">
        <div id="headerTop">
            <img src={logo} id="headerLogo" alt="NDSU" />
        </div>
        <div id="headerBottom">
            Upper Great Plains Transportation Institute
        </div>
    </div>
  );
};

export default Header;
