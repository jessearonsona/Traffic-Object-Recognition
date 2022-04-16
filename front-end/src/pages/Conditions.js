// TODO: Conditionally render OptionPane if Connect to camera is selected
import "../styling/TrackingAndConditions.css";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import OptionPane from "../components/OptionPane";
import {Button, Container, Grid, IconButton, Input, Tooltip, Typography} from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import React, {useCallback, useRef, useState} from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {useLocation, useNavigate} from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import IosShareIcon from '@mui/icons-material/IosShare';

// It's possible to load the model locally or from a repo
// You can choose whatever IP and PORT you want in the "http://127.0.0.1:8080/model.json" just set it
// before in your https server

// Get road conditions model
async function getConditionsModel() {
    return await tf.loadGraphModel("http://127.0.0.1:8080/model.json");
}

const Conditions = () => {
    // Initialize states
    const [showWebcam, setShowWebcam] = useState(false);
    const videoRef = useRef(null);
    const [road, setRoad] = useState("");
    const [photoTime, setPhotoTime] = useState("")
    const [duration, setDuration] = useState("")
    const navigate = useNavigate();
    const location = useLocation();
    //Compatible file types
    const imageTypes = ["jpg", "jpeg", "png"];
    const videoTypes = ["mp4", "mkv", "wmv", "mov"];
    // Conditions
    const ROAD_CONDITIONS = {
        0: "Clear",
        1: "Ice",
        2: "Partial Snow",
        3: "Snow",
        4: "Wet"

    };

    var csvOutput = [['Date', 'Time', 'Condition'],];

    // Get all info from child components
    const getRoad = useCallback((data) => {
        setRoad(data)
    }, []);
    const getPhotoTime = useCallback((data) => {
        setPhotoTime(data)
    }, []);
    const getDuration = useCallback((data) => {
        setDuration(data)
    }, []);

    // Validate and redirect to running page
    function start() {
        if (validate()) {
            navigate("/running", {
                state:
                    {model: (location.pathname).substring(1), road: road, photoTime: photoTime, duration: duration}
            });
        }

        // Show missing field
        else {
            document.getElementById("missing-field").style.display = "block";
        }
    }

    // Checks that all fields are filled in
    function validate() {
        if (road === "") {
            return false;
        } else if (photoTime === "" || isNaN(parseFloat(photoTime))) {
            return false;
        } else return !(duration === "" || isNaN(parseFloat(duration)));
    }

    //Called when file is uploaded
    function upload(event) {
        let videoSrc = document.getElementById("video-source");
        let videoTag = document.getElementById("videoPreview");
        let imgTag = document.getElementById("imagePreview");

        //Checks if a file is uploaded
        if (event.target.files && event.target.files[0]) {
            let extension = event.target.files[0].name.split(".").pop().toLowerCase();
            let reader = new FileReader();

            //If file is image
            if (imageTypes.includes(extension)) {
                reader.onload = function (e) {
                    imgTag.src = e.target.result;
                }.bind(this);
                imgTag.style.display = "block";
                videoTag.style.display = "none";
                document.getElementById("upload-button").style.marginTop = "5px";
                //const model = load_model();
                //alert(model.summary());
                runConditionsModel(imgTag);
            }

            //If file is video
            else if (videoTypes.includes(extension)) {
                reader.onload = function (e) {
                    videoSrc.src = e.target.result;
                    videoTag.load();
                }.bind(this);
                videoTag.style.display = "block";
                imgTag.style.display = "none";
                document.getElementById("upload-button").style.marginTop = "5px";
            }

            //Incompatible type
            else {
                let error = "Incompatible file type.\nCompatible file types:\n";
                error += imageTypes.join(", ") + ", " + videoTypes.join(", ");
                alert(error);
            }

            reader.readAsDataURL(event.target.files[0]);
        }
    }

    function getTime() {
        const hour = new Date().getHours();
        const minute = new Date().getMinutes();
        const second = new Date().getSeconds();

        const time = hour + ":" + minute + ":" + second;

        return time;
    }

    function getDate() {
        const day = new Date().getDate();
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const date = day + '/' + month + '/' + year;

        return date;
    }

    function download_csv() {
        var csv = '';
        csvOutput.forEach(function (row) {
            csv += row.join(',');
            csv += "\n";
        })

        var hiddenElm = document.createElement('a');
        hiddenElm.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElm.target = '_blank';

        hiddenElm.download = 'Condition Report.csv';
        hiddenElm.click();
    }

    // Runs the conditions model on webcam image
    async function runConditionsModel(image) {
        const model = await getConditionsModel();

        //converting the image to a formatted tensor
        let tensor = tf.browser.fromPixels(image, 3)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()

        //feeding the image in.
        let predictions = await model.predict(tensor).data();

        const evalOutput = model.evaluate

        let top5 = Array.from(predictions)
            .map(function (p, i) { // this is Array.map
                return {
                    probability: p,
                    className: ROAD_CONDITIONS[i] // we are selecting the value from the obj
                };
            }).sort(function (a, b) {
                // console.log("b: " + b + b.probability)
                return b.probability - a.probability;
            }).slice(0, 5); //Determines how many of the top results it shows

        let output = "Predictions: ";
        top5.forEach(function (p) {
            output += `${p.className}: ${p.probability.toFixed(6)}\n`; //probability is not probability atm. Need to fix
        });

        //console.log(top5); //showing our current prediction. This is what we need.
        console.log(top5[0].className);
        csvOutput.push([getDate(), getTime(), top5[0].className]);
        console.log(csvOutput);

        // Show export button
        document.getElementById("export-button").style.display = "block";

        alert("Prediction: " + top5[0].className)
    }

    // Show webcam video
    function displayWebcam() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({
                    audio: false,
                    video: true
                }).then((stream) => {
                setShowWebcam(true)
                document.getElementById("cameraConnect").style.display = "none";
                videoRef.current.srcObject = stream;
            });
        }
    }

    return (
        <div className="container">
            <Header/>
            <main id="mainContent">
                <Grid container>
                    <Grid item xs={0} lg={1}>
                        {/* spacer */}
                    </Grid>
                    <Grid item xs={12} lg={10}>
                        <Subheader getRoad={getRoad}/>
                        <div className="center">
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item direction="column" justifyContent="center">
                                    <Container>
                                        <Typography id="label-header" variant="h4">
                                            Live Camera
                                        </Typography>
                                        <div id="cameraConnect">
                                            <Button
                                                id="connect-button"
                                                variant="contained"
                                                color="primary"
                                                component="span"
                                                startIcon={<CameraAltIcon/>}
                                                onClick={displayWebcam}
                                                style={{marginTop: "100px"}}
                                            >
                                                Connect
                                            </Button>
                                        </div>
                                        {showWebcam && (
                                            <video
                                                id="webcamVideo"
                                                autoPlay
                                                playsInline
                                                ref={videoRef}
                                            />
                                        )}
                                    </Container>
                                </Grid>
                                <Grid
                                    item
                                    direction="column"
                                    justifyContent="center"
                                    id="dividerGrid"
                                >
                                    <Container>
                                        <div id="divider"/>
                                    </Container>
                                </Grid>
                                <Grid item direction="column" justifyContent="center">
                                    <Container>
                                        <div id="dividerHorizontal"/>
                                    </Container>
                                    <Typography id="label-header" variant="h4">
                                        Upload Image or Video
                                    </Typography>
                                    <Container id="uploadContainer">
                                        <div id="previewDiv">
                                            <video
                                                className={"preview"}
                                                id="videoPreview"
                                                controls
                                                style={{
                                                    display: "none",
                                                    maxWidth: "400px",
                                                    maxHeight: "300px",
                                                }}
                                            >
                                                <source id="video-source" src="splashVideo"/>
                                                Your browser does not support HTML5 video.
                                            </video>
                                            <img
                                                src="splashImage"
                                                id="imagePreview"
                                                className={"preview"}
                                                style={{
                                                    display: "none",
                                                    maxWidth: "400px",
                                                    maxHeight: "300px",
                                                }}
                                            />
                                        </div>
                                        <div id="center">
                                            <label htmlFor="file-upload">
                                                <Input
                                                    accept="Video/*,Image/*"
                                                    id="file-upload"
                                                    onChange={upload}
                                                    multiple
                                                    type="file"
                                                    value={""}
                                                    style={{display: "none"}}
                                                />
                                                <Grid container columnSpacing={{xs: 1, sm: 2, md: 3}} justifyContent={"center"}>
                                                    <Grid item>
                                                        <Button
                                                            id="upload-button"
                                                            variant="contained"
                                                            color="primary"
                                                            component="span"
                                                            startIcon={<AddIcon/>}
                                                            style={{margin: "5px", marginTop: "100px"}}
                                                        >
                                                            Upload
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Tooltip title="Export report to csv" style={{display: "none"}}>
                                                            <IconButton id="export-button" onClick={download_csv}>
                                                                <IosShareIcon style={{color: "#18563e"}}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>
                                            </label>
                                        </div>
                                    </Container>
                                </Grid>
                            </Grid>
                        </div>
                        <OptionPane getPhotoTime={getPhotoTime} getDuration={getDuration}/>
                        <div id="buttonDiv">
                            <Typography
                                id="missing-field"
                                style={{display: "none", color: "red"}}
                                variant="body1"
                            >
                                <b>Please fill in all fields.</b>
                            </Typography>
                            <Button
                                id="startButton"
                                variant="contained"
                                color="primary"
                                onClick={start}
                            >
                                Start
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={0} lg={1}>
                        {/* spacer */}
                    </Grid>
                </Grid>
            </main>
        </div>
    );
};

export default Conditions;
