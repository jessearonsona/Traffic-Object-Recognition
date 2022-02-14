import "../styling/TrackingAndConditions.css";
import Header from "../components/Header";
import { Typography } from "@mui/material";

const Tracking = () => {
  return (
    <div className="mainContainer">
      <Header />
      <body id="body">
        <Typography variant="h5">Vehicle Tracking Page</Typography>
      </body>
    </div>
  );
};

export default Tracking;
