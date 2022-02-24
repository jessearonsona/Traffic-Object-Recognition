// TODO: Move styling from Subheader.css to TrackingAndCondtions.css when integrating with
// Vincent's part, remove code blocks used for testing
import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import roads from "../arrays/roads";
import "../styling/TrackingAndConditions.css";
import "./Subheader.css";

const Subheader = () => {
  // Get current page to use for conditional rendering
  const location = useLocation();
  const pathname = location.pathname;

  // Get selection from roads dropdown
  const [value, setValue] = useState("");
  const handleChange = (e) => setValue(e.target.value);

  // Function to change the variant of the page selector buttons depending on which
  // page is currently selected
  const setBtnVariant = (path, id) => {
    if (id === "VTBtn") {
      return path === "/tracking" ? "contained" : "outlined";
    } else {
      return path === "/tracking" ? "outlined" : "contained";
    }
  };

  return (
    <div id="subheaderContainer">
      <Grid container id="subheaderGrid">
        <Grid item xs={12} id="pageSelector">
          <ButtonGroup>
            <Button
              id="VTBtn"
              href="/tracking"
              variant={setBtnVariant(pathname, "VTBtn")}
              size="large"
              color="primary"
            >
              Vehicle Tracking
            </Button>
            <Button
              id="RCBtn"
              href="/conditions"
              variant={setBtnVariant(pathname, "RCBtn")}
              size="large"
              color="primary"
            >
              Road Conditions
            </Button>
          </ButtonGroup>
        </Grid>

        <Grid item xs={12} id="roadSelector">
          <FormControl id="dropdownBox" variant="outlined" size="small">
            <InputLabel id="dropdownLabel">Road/Intersection</InputLabel>
            <Select
              labelId="dropdownLabel"
              id="roadDropdown"
              value={value}
              onChange={handleChange}
              label="Road/Intersection"
            >
              {roads.map((road, index) => {
                return (
                  <MenuItem key={index} value={index}>
                    {road}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        {/* -----------------!!! REMOVE AFTER TESTING !!!----------------- */}
        {/* <Grid item xs={12}>
          <Typography align="center">You Selected: {roads[value]}</Typography>
        </Grid> */}
        {/* -------------------------------------------------------------- */}
      </Grid>
    </div>
  );
};

export default Subheader;
