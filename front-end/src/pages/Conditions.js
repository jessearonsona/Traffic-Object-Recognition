import "../styling/TrackingAndConditions.css";
import Header from "../components/Header";
import { Typography } from "@mui/material";

const Conditions = () => {
  return (
    <div className="container">
      <Header />
      <main id="mainContent">
        <Typography variant="h5">Road Conditions Page</Typography>
      </main>
    </div>
  );
};

export default Conditions;
