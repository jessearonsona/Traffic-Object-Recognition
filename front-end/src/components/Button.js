import PropTypes from "prop-types";

const Button = ({ color, text }) => {
  return <button className="button">{text}</button>;
};

Button.defaultProps = {
  color: "gray",
};

Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
};
export default Button;
