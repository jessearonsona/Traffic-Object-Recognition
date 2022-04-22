import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../styling/TrackingAndConditions.css";

const Subheader = () => {
  // Get current page to use for conditional rendering
  const location = useLocation();
  const pathname = location.pathname;

  // Set states for roads array to populate road/intersection dropdown
  const [roadData, setRoadData] = useState([]);

  // Get selection from roads dropdown
  const [value, setValue] = useState("");
  const handleChange = (e) => setValue(e.target.value);

  // Function to change the look of the page selector buttons depending on which
  // page is currently selected
  const setBtnVariant = (path, id) => {
    if (id === "VTBtn") {
      return path === "/tracking" ? "contained" : "outlined";
    } else {
      return path === "/tracking" ? "outlined" : "contained";
    }
  };

  // Get all roads/intersections where cameras are located
  const populateRoadDropdown = async () => {
    try {
      const response = await axios.get("/api/roads");
      setRoadData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Populate road dropdown when page initially loads
  useEffect(() => {
    populateRoadDropdown();
  }, []);

  // Array to hold list of camera stations retrieved from DB
  const roads = [...roadData];

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
                    {String(road.Station__Number)} - {road.Stations_Name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default Subheader;
