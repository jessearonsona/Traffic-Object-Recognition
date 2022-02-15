import "../styling/TrackingAndConditions.css";
import Header from "../components/Header";
import { Typography } from "@mui/material";

const Tracking = () => {
  return (
    <div className="container">
      <Header />
      <main id="mainContent">
        <Typography variant="h5">Vehicle Tracking Page</Typography>
      </main>
    </div>
  );
};

export default Tracking;
