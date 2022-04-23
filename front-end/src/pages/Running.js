import React, {useEffect, useRef, useState} from "react";
import "../styling/Running.css";
import Header from "../components/Header.js";
import Timer from "../components/Timer";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import {useLocation} from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import {loadGraphModel} from "@tensorflow/tfjs-converter";

// Set to true to override photo/report time to every second
const TESTING = true;


// It's possible to load the model locally or from a repo
// You can choose whatever IP and PORT you want in the "http://127.0.0.1:8080/model.json" just set it
// before in your https server

// Get road conditions model
async function getConditionsModel() {
    return await tf.loadGraphModel("http://127.0.0.1:8080/model.json");
}

// Get tracking model
async function getTrackingModel() {
    await tf.setBackend("webgl");
    return await loadGraphModel("http://127.0.0.1:8080/model.json");
    // return await loadGraphModel("https://raw.githubusercontent.com/hugozanini/TFJS-object-detection/master/models/kangaroo-detector/model.json");
}

const THRESHOLD = 0.5;
var csvOutput = [ ['Date', 'Time', 'Condition'],];

let VEHICLE_CLASSES = {
    1: {
        name: "Passenger",
        id: 1,
    },
    2: {
        name: "Bus",
        id: 2,
    },
    3: {
        name: "Single Unit Truck",
        id: 3,
    },
    4: {
        name: "Multi Unit Truck",
        id: 4,
    },
};

const ROAD_CONDITIONS = {
    0: "Clear",
    1: "Ice",
    2: "Partial Snow",
    3: "Snow",
    4: "Wet"

};

const Running = () => {
    // Initialize state
    const location = useLocation();
    const [time, setTime] = useState(0);
    const [timer, setTimer] = useState(false)
    const [title, setTitle] = useState("")
    const [road, setRoad] = useState("")
    const [reportTime, setReportTime] = useState(1)
    const [duration, setDuration] = useState(0)
    const [model, setModel] = useState(null)
    const [direction, setDirection] = useState("")
    const [line, setLine] = useState("")
    const [stopPopup, setStopPopup] = useState(false)
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
 

    // Increment timer, run condition model, and send report
    useEffect(() => {
        if (timer) {
            let interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1000);
            }, 1000);

            let stopTime = Math.round(duration * 3600000);

            if(time % stopTime === 0 && time != 0){
                stop()
            }

            // If running conditions and time to run model
            let testTime = reportTime * 60000;
            if( model === "Conditions" && time % testTime === 0) {
                runConditionsModel()
            }

            // If running tracking and time to send report
            if( model === "Tracking" && time % testTime === 0) {
                runConditionsModel()
            }

            return () => clearInterval(interval);
        }
    }, [duration, model, reportTime, time, timer]);

    // Get info from previous page
    function getInfo() {
        setModel(location.state.model)
        setDuration(location.state.duration)
        setRoad(location.state.road)

        if (location.state.model === "Conditions") {
            setTitle("Running Road Conditions")
            setReportTime(location.state.photoTime)
        } else if (location.state.model === "Tracking") {
            setTitle("Counting Vehicles")
            setReportTime(location.state.reportTime)
            setDirection(location.state.direction)
            setLine(location.state.line)
        }
    }

    // Initialize
    useEffect(() => {
        // If not coming from conditions/tracking pages
        if (location.state === null) {
            // Redirect to tracking page
            window.location.replace("/tracking")
        } else if (videoRef.current.srcObject == null) {
            getInfo()
            getVideo()
        }
    }, [getInfo, location.state]);

    // Align canvas on top of video element
    function alignCanvas() {
        let rect = videoRef.current.getBoundingClientRect();
        let ref = canvasRef.current;

        ref.width = rect.width;
        ref.height = rect.height;
        ref.className = "canvas";
    }

    // Update canvas position on window resize
    useEffect(() => {
        if (model === "tracking" && timer) {
            window.addEventListener("resize", () => {
                alignCanvas()
            });
            return () => {
                window.removeEventListener("resize", () => {
                    alignCanvas()
                })
            }
        }
    }, [model, timer]);

    // Get webcam video
    function getVideo(){
        navigator.mediaDevices
            .getUserMedia({video: true, audio: false})
            .then(stream => {
                let video = videoRef.current;
                video.srcObject = stream;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // Finalize report info, stop video, and redirect
    function stop() {
        setTimer(false)
        download_csv();
        // Stop webcam
        let video = videoRef.current.srcObject;
        video.getTracks().forEach(function (track) {
            track.stop()
        });



        // Redirect
        window.location.replace("/" + model)
    }

    // Start model
    function start() {
        setTimer(true)

        if (model === "tracking") {
            alignCanvas()
            runTrackingModel()
        }
    }

    // Add to recent report info box
    function appendReport(info) {
        const reportElement = document.getElementById("report-info")
        let hour = Math.floor((time / 3600000) % 60);
        let min = Math.floor((time / 60000) % 60);
        let sec = (time / 1000) % 60
        info = hour + ":" + min + ":" + sec + ": " + info

        if (reportElement.innerHTML === "") {
            reportElement.innerHTML = info
        } else {
            reportElement.innerHTML += "</br>" + info
        }

        // Auto scroll to bottom of report
        reportElement.scrollTop = reportElement.scrollHeight;
    }

    // Gets image from webcam for conditions model
    function getImage() {
        const canvas = document.createElement("canvas");
        const video = videoRef.current;

        // Scale the canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame on canvas
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();
        let image = document.createElement("img");
        image.src = dataURL;
        return image;
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
        const month = new Date().getMonth() + 1;
        const date = month + '/' + day + '/' + year;
        
        return date;
    }

    function download_csv() {
        var csv = '';
        csvOutput.forEach(function(row) {
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
    async function runConditionsModel() {
        // Get image
        let image = getImage()

        const model = await getConditionsModel();

        //converting the image to a formatted tensor
        let tensor = tf.browser.fromPixels(image, 3)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()

        //feeding the image in.
        let predictions = await model.predict(tensor).data();

        let top5 = Array.from(predictions)
            .map(function (p, i) { // this is Array.map
                return {
                    probability: p,
                    className: ROAD_CONDITIONS[i] // we are selecting the value from the obj
                };
            }).sort(function (a, b) {
                return b.probability - a.probability;
            }).slice(0, 5); //Determines how many of the top results it shows

        // Appending the prediction onto the report
        csvOutput.push([getDate(), getTime(), top5[0].className]);

        // Display report info on page
        appendReport(top5[0].className)
    }

    function process_input(videoFrame) {
        const tfImg = tf.browser.fromPixels(videoFrame).toInt();
        return tfImg.transpose([0, 1, 2]).expandDims();
    }

    function buildDetectedObjects(scores, threshold, boxes, classes, classesDir) {
        const detectionObjects = [];
        let video_frame = document.getElementById("video");

        scores[0].forEach((score, i) => {
            if (score > threshold) {
                const bbox = [];
                const minY = boxes[0][i][0] * video_frame.offsetHeight;
                const minX = boxes[0][i][1] * video_frame.offsetWidth;
                const maxY = boxes[0][i][2] * video_frame.offsetHeight;
                const maxX = boxes[0][i][3] * video_frame.offsetWidth;
                bbox[0] = minX;
                bbox[1] = minY;
                bbox[2] = maxX - minX;
                bbox[3] = maxY - minY;
                detectionObjects.push({
                    class: classes[i],
                    label: classesDir[classes[i]].name,
                    score: score.toFixed(4),
                    bbox: bbox,
                });

                // appendReport(classesDir[classes[i]].name)
            }
        });
        return detectionObjects;
    }

    function runTrackingModel(){
        const modelPromise = getTrackingModel();

        Promise.all([modelPromise])
            .then((values) => {
                detectFrame(videoRef.current, values[0]);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function renderPredictions(predictions){
        let ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Font options.
        const font = "16px sans-serif";
        ctx.font = font;
        ctx.textBaseline = "top";

        //Getting predictions

        // Car Model 4 classes
        const boxes = predictions[2].arraySync();
        // [4] could be scores [[float; 5]; 100]. [7] could be scores [float; 100]
        const scores = predictions[7].arraySync();
        // [5] is def classes
        const classes = predictions[5].dataSync();

        const detections = buildDetectedObjects(
            scores,
            THRESHOLD,
            boxes,
            classes,
            VEHICLE_CLASSES
        );

        detections.forEach((item) => {
            const x = item["bbox"][0];
            const y = item["bbox"][1];
            const width = item["bbox"][2];
            const height = item["bbox"][3];

            // Draw the bounding box.
            ctx.strokeStyle = "#00FFFF";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);

            // Draw the label background.
            ctx.fillStyle = "#00FFFF";
            const textWidth = ctx.measureText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%").width;
            const textHeight = parseInt(font, 10); // base 10
            ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
        });

        detections.forEach((item) => {
            const x = item["bbox"][0];
            const y = item["bbox"][1];

            // Draw the text last to ensure it's on top.
            ctx.fillStyle = "#000000";
            ctx.fillText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%", x, y);
        });
    }

    function detectFrame(video, model) {
        tf.engine().startScope();
        model.executeAsync(process_input(video)).then((predictions) => {
            renderPredictions(predictions, video);
            requestAnimationFrame(() => {
                detectFrame(video, model);
            });
            tf.engine().endScope();
        });
    }

    return (
        <div>
            <Header/>
            <div className="mainContent">
                <Typography align="center" variant="h4" style={{fontSize: "24px", marginBottom: "20px"}}>
                    {title}
                </Typography>
                <Grid container spacing={0} className="center">
                    <Grid item xs="auto" className="info">
                        <Timer time={time}/>
                        <br/>
                        <Typography align="left" variant="body1" style={{fontSize: "16px"}}>
                            <b>Intersection/Road:</b>
                        </Typography>
                        <Typography align="left" variant="body1" style={{fontSize: "16px", paddingLeft: "10px"}}>
                            {road}
                        </Typography>
                        <br/>
                        <Typography align="left" variant="body1" style={{fontSize: "16px"}}>
                            <b>Report:</b>
                        </Typography>
                        <Typography id="report-info" variant="body1"/>
                    </Grid>
                    <Grid item xs="auto" style={{padding: "0px"}}>
                        <div className="video-container">
                            <video
                                id="video"
                                autoPlay
                                playsInline
                                muted
                                onLoadedMetadata={start}
                                ref={videoRef}
                            />
                            <canvas className="canvas" ref={canvasRef}/>
                        </div>
                        <Button id="stop-button" variant="contained" color="primary" onClick={() => {
                            setStopPopup(true)
                        }}>
                            Stop
                        </Button>
                    </Grid>
                </Grid>
            </div>
            <Dialog open={stopPopup} onClose={() => {
                setStopPopup(false)
            }}>
                <DialogTitle>Stop</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to stop?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setStopPopup(false)
                    }}>Cancel</Button>
                    <Button style={{color: "red"}} onClick={stop}>Stop</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Running;