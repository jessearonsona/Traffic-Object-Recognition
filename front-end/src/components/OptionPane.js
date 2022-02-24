// TODO: Move styling from OptionPane.css to TrackingAndCondtions.css when integrating with Vincent's part
import "../styling/TrackingAndConditions.css";
import "./OptionPane.css";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const OptionPane = () => {
  // Get current page to use for conditional rendering
  const location = useLocation();
  const pathname = location.pathname;

  const [line, setLine] = useState("vertical");
  const [direction, setDirection] = useState("north");
  const [reportTime, setReportTime] = useState("15");
  const [photoTime, setphotoTime] = useState("10");
  const [duration, setDuration] = useState("48");

  /* Function to set the visibility of Options depending on which page is currently selected
     "Duration of detection" option renders on both pages 
  */
  const setVisibility = (path, id) => {
    if (id === "vtOption") {
      return path === "/tracking" ? true : false;
    } else {
      return path === "/tracking" ? false : true;
    }
  };

  return (
    <div id="optionContainer">
      <Grid container id="optionGrid">
        <Grid item xs={12} id="sectionTitleBox">
          <Typography id="sectionTitle">Options</Typography>
        </Grid>

        {setVisibility(pathname, "vtOption") && (
          <Grid item xs={12} sm={3} id="radioContainer">
            <FormControl>
              <FormLabel id="groupLabel">Tracking line:</FormLabel>
              <RadioGroup
                // id="radioGroup"
                value={line}
                onChange={(e) => setLine(e.target.value)}
              >
                <FormControlLabel
                  value="vertical"
                  control={<Radio color="primary" />}
                  label="Vertical"
                ></FormControlLabel>
                <FormControlLabel
                  value="horizontal"
                  control={<Radio color="primary" />}
                  label="Horizontal"
                ></FormControlLabel>
              </RadioGroup>
              {/* <Typography>
              Left click on tracking line and drag to desired position in frame
            </Typography> */}
            </FormControl>
          </Grid>
        )}

        {setVisibility(pathname, "vtOption") && (
          <Grid item xs={12} sm={3} id="radioContainer">
            <FormControl>
              <FormLabel id="groupLabel">Direction of "Up":</FormLabel>
              <RadioGroup
                // id="radioGroup"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              >
                <FormControlLabel
                  value="north"
                  control={<Radio color="primary" />}
                  label="North"
                ></FormControlLabel>
                <FormControlLabel
                  value="south"
                  control={<Radio color="primary" />}
                  label="South"
                ></FormControlLabel>
                <FormControlLabel
                  value="east"
                  control={<Radio color="primary" />}
                  label="East"
                ></FormControlLabel>
                <FormControlLabel
                  value="west"
                  control={<Radio color="primary" />}
                  label="West"
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </Grid>
        )}

        {setVisibility(pathname, "vtOption") && (
          <Grid item xs={12} sm={3} id="radioContainer">
            <FormControl>
              <FormLabel id="groupLabel">Send reports every:</FormLabel>
              <RadioGroup
                // id="radioGroup"
                value={reportTime}
                onChange={(e) => setReportTime(e.target.value)}
              >
                <FormControlLabel
                  value="15"
                  control={<Radio color="primary" />}
                  label="15 min"
                ></FormControlLabel>
                <FormControlLabel
                  value="60"
                  control={<Radio color="primary" />}
                  label="60 min"
                ></FormControlLabel>
                <FormControlLabel
                  value={"custom"}
                  control={<Radio color="primary" />}
                  label="Custom (min)"
                ></FormControlLabel>
              </RadioGroup>
              <TextField
                id="customField"
                variant="outlined"
                size="small"
                disabled={reportTime !== "custom"}
              ></TextField>
            </FormControl>
          </Grid>
        )}

        {setVisibility(pathname, "rcOption") && (
          <Grid item xs={12} sm={3} id="radioContainer">
            <FormControl>
              <FormLabel id="groupLabel">
                Minimum time between photos:
              </FormLabel>
              <RadioGroup
                // id="radioGroup"
                value={photoTime}
                onChange={(e) => setphotoTime(e.target.value)}
              >
                <FormControlLabel
                  value="10"
                  control={<Radio color="primary" />}
                  label="10 min"
                ></FormControlLabel>
                <FormControlLabel
                  value="30"
                  control={<Radio color="primary" />}
                  label="30 min"
                ></FormControlLabel>
                <FormControlLabel
                  value="custom"
                  control={<Radio color="primary" />}
                  label="Custom (min)"
                ></FormControlLabel>
              </RadioGroup>
              <TextField
                id="customField"
                variant="outlined"
                size="small"
                disabled={photoTime !== "custom"}
              ></TextField>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} sm={3} id="radioContainer">
          <FormControl>
            <FormLabel id="groupLabel">Duration of detection:</FormLabel>
            <RadioGroup
              // id="radioGroup"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <FormControlLabel
                value="48"
                control={<Radio color="primary" />}
                label="48 hrs"
              ></FormControlLabel>
              <FormControlLabel
                value="custom"
                control={<Radio color="primary" />}
                label="Custom (hrs)"
              ></FormControlLabel>
            </RadioGroup>
            <TextField
              id="customField"
              variant="outlined"
              size="small"
              disabled={duration !== "custom"}
            ></TextField>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default OptionPane;
