// Move styling from ButtonGroup.css to TrackingAndCondtions.css when integrating with Vincent's part
import "../styling/TrackingAndConditions.css";
import "./ButtonGroup.css";
import { Button, Grid } from "@material-ui/core";

const ButtonGroup = () => {
  return (
    <div id="buttonContainer">
      <Grid container id="buttonGrid">
        <Grid item>
          <Button id="cancelButton" variant="outlined" color="primary">
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button id="startButton" variant="contained" color="primary">
            Start
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ButtonGroup;
