// Move styling from Subheader.css to TrackingAndCondtions.css when integrating with Vincent's part
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
import "../styling/TrackingAndConditions.css";
import "./Subheader.css";

// Need to put road/intersection dropdown options in a data structure and map it

const Subheader = () => {
  const location = useLocation();
  const pathname = location.pathname;

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
          <FormControl id="dropDownBox" variant="outlined" size="small">
            <InputLabel id="roadDropdownLabel">Road/Intersection</InputLabel>
            <Select
              labelId="roadDropdownLabel"
              id="roadDropdown"
              //   value={road}
              //   onChange={handleChange}
              label="Road/Intersection"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}>I-94</MenuItem>
              <MenuItem value={2}>I-29</MenuItem>
              <MenuItem value={3}>Calgary & State Street</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default Subheader;
