import "../styling/TrackingAndConditions.css";
import Timer from "./Timer";
import { Button, Grid, Typography } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ButtonGroup = () => {
  // Get current page to use for conditional rendering
  const location = useLocation();
  const pathname = location.pathname;

  const setMessage = (path) => {
    return path === "/tracking"
      ? "Vehicle Tracking Model Running..."
      : "Road Condition Model Running...";
  };

  // Objects to hide certain components based on if the model is running or not
  const [modelRunning, setModelRunning] = useState(false);

  const showElement = (modelRunning) => {
    return modelRunning ? false : true;
  };

  // Objects used for start, stop and reset of the timer
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  return (
    <div id="buttonContainer">
      {showElement(modelRunning) && (
        <Grid container id="buttonGrid">
          <Grid item>
            <Button id="cancelButton" variant="outlined" color="primary">
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              id="startButton"
              variant="contained"
              color="primary"
              onClick={() => {
                setTimerOn(true);
                setModelRunning(true);
              }}
            >
              Start
            </Button>
          </Grid>
        </Grid>
      )}
      {/* ****************************COMMENT OUT IF NOT READY******************************** */}
      {showElement(!modelRunning) && (
        <Grid container id="runningGrid">
          <Grid item xs={12} sm={4}>
            <Typography id="runMessage">{setMessage(pathname)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Timer time={time} />
          </Grid>
          <Grid item>
            <Button
              id="quitButton"
              variant="contained"
              color="primary"
              onClick={() => {
                setTimerOn(false);
                setTime(0);
                setModelRunning(false);
              }}
            >
              Quit
            </Button>
          </Grid>
        </Grid>
      )}
      {/* *********************************************************************************** */}
    </div>
  );
};

export default ButtonGroup;
