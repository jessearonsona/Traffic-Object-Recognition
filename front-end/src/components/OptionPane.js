import "../styling/TrackingAndConditions.css";
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
import {useLocation} from "react-router-dom";
import {useState} from "react";

const OptionPane = (props) => {
    // Get current page to use for conditional rendering
    const location = useLocation();
    const pathname = location.pathname;

    const [line, setLine] = useState("");
    const [direction, setDirection] = useState("");
    const [reportTime, setReportTime] = useState("");
    const [photoTime, setphotoTime] = useState("");
    const [duration, setDuration] = useState("");

    /* Function to set the visibility of Options depending on which page is currently selected
       "Duration of detection" option renders on both pages
    */
    const setVisibility = (path, id) => {
        if (id === "vtOption") {
            return path === "/tracking";
        } else {
            return path !== "/tracking";
        }
    };

    // Send line info to parent component (conditions/tracking)
    function changeLine(e) {
        setLine(e.target.value)
        props.getLine(e.target.value);
    }

    // Send direction info to parent component (conditions/tracking)
    function changeDirection(e) {
        setDirection(e.target.value)
        props.getDirection(e.target.value);
    }

    // Send report time info to parent component (conditions/tracking)
    function changeReportTime(e) {
        // If custom field
        if (e.target.id === "customField") {
            props.getReportTime(e.target.value)
        } else {
            setReportTime(e.target.value)
            props.getReportTime(e.target.value)
        }
    }

    // Send photo time info to parent component (conditions/tracking)
    function changePhotoTime(e) {
        // If custom field
        if (e.target.id === "customField") {
            props.getPhotoTime(e.target.value);
        } else {
            setphotoTime(e.target.value)
            props.getPhotoTime(e.target.value);
        }
    }

    // Send duration info to parent component (conditions/tracking)
    function changeDuration(e) {
        // If custom field
        if (e.target.id === "customField") {
            props.getDuration(e.target.value)
        } else {
            setDuration(e.target.value)
            props.getDuration(e.target.value)
        }
    }

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
                                onChange={changeLine}
                            >
                                <FormControlLabel
                                    value="vertical"
                                    control={<Radio color="primary"/>}
                                    label="Vertical"
                                />
                                <FormControlLabel
                                    value="horizontal"
                                    control={<Radio color="primary"/>}
                                    label="Horizontal"
                                />
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
                                onChange={changeDirection}
                            >
                                <FormControlLabel
                                    value="north"
                                    control={<Radio color="primary"/>}
                                    label="North"
                                />
                                <FormControlLabel
                                    value="south"
                                    control={<Radio color="primary"/>}
                                    label="South"
                                />
                                <FormControlLabel
                                    value="east"
                                    control={<Radio color="primary"/>}
                                    label="East"
                                />
                                <FormControlLabel
                                    value="west"
                                    control={<Radio color="primary"/>}
                                    label="West"
                                />
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
                                onChange={changeReportTime}
                            >
                                <FormControlLabel
                                    value="15"
                                    control={<Radio color="primary"/>}
                                    label="15 min"
                                />
                                <FormControlLabel
                                    value="60"
                                    control={<Radio color="primary"/>}
                                    label="60 min"
                                />
                                <FormControlLabel
                                    value={"custom"}
                                    control={<Radio color="primary"/>}
                                    label="Custom (min)"
                                />
                            </RadioGroup>
                            {reportTime === "custom" &&
                                <TextField
                                    id="customField"
                                    variant="outlined"
                                    size="small"
                                    onChange={changeReportTime}
                                />
                            }
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
                                onChange={changePhotoTime}
                            >
                                <FormControlLabel
                                    value="10"
                                    control={<Radio color="primary"/>}
                                    label="10 min"
                                />
                                <FormControlLabel
                                    value="30"
                                    control={<Radio color="primary"/>}
                                    label="30 min"
                                />
                                <FormControlLabel
                                    value="custom"
                                    control={<Radio color="primary"/>}
                                    label="Custom (min)"
                                />
                            </RadioGroup>
                            {photoTime === "custom" &&
                                <TextField
                                    id="customField"
                                    variant="outlined"
                                    size="small"
                                    onChange={changePhotoTime}
                                />
                            }
                        </FormControl>
                    </Grid>
                )}

                <Grid item xs={12} sm={3} id="radioContainer">
                    <FormControl>
                        <FormLabel id="groupLabel">Duration of detection:</FormLabel>
                        <RadioGroup
                            // id="radioGroup"
                            value={duration}
                            onChange={changeDuration}
                        >
                            <FormControlLabel
                                value="48"
                                control={<Radio color="primary"/>}
                                label="48 hrs"
                            />
                            <FormControlLabel
                                value="custom"
                                control={<Radio color="primary"/>}
                                label="Custom (hrs)"
                            />
                        </RadioGroup>
                        {duration === "custom" &&
                            <TextField
                                id="customField"
                                variant="outlined"
                                size="small"
                                onChange={changeDuration}
                            />
                        }
                    </FormControl>
                </Grid>
            </Grid>
        </div>
    );
};

export default OptionPane;
