import "../styling/TrackingAndConditions.css";
import Header from "../components/Header";
import { Typography } from "@mui/material";

const Conditions = () => {
  return (
    <div className="mainContainer">
      <Header />
      <body id="body">
        <Typography variant="h5">Road Conditions Page</Typography>
      </body>
    </div>
  );
};

export default Conditions;
