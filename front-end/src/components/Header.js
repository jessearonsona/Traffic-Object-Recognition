//Style is inlined just for practice, move all styling to .css files
import PropTypes from "prop-types";
import Button from "./Button";

const Header = () => {
  return (
    <header>
      <h1 style={{ color: "red" }}>
        Future home of UGPTI Vehicle Tracking/Road Condition application
      </h1>
      <Button color="steelblue" text="Vehicle Tracking" />
      <Button color="steelblue" text="Road Condition" />
    </header>
  );
};

export default Header;
