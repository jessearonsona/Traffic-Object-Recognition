// TODO: 1) Add Connect to camera button
//       2) Conditionally render OptionPane if Connect to camera is selected
//          (tracking and direction options only if recorded video is selected, none if image is selected)
//       3) Add instruction for clicking/dragging tracking line
//       4) Auto-quit when time to run model has elapsed or when recorded video is complete
//       5) Components to show results for recorded video or still image with option to send to DB?

import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button, Container, Grid, Input, Typography } from "@material-ui/core";
import { loadGraphModel } from "@tensorflow/tfjs-converter";

import Webcam from "react-webcam";
import AddIcon from "@mui/icons-material/Add";
import * as tf from "@tensorflow/tfjs";

import "../styling/TrackingAndConditions.css";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import ButtonGroup from "../components/ButtonsGroup";
import OptionPane from "../components/OptionPane";

tf.setBackend("webgl");

async function load_model() {
  // It's possible to load the model locally or from a repo
  // You can choose whatever IP and PORT you want in the "http://127.0.0.1:8080/model.json" just set it before in your https server
  const model = await loadGraphModel("http://127.0.0.1:8080/model.json");
  //const model = await loadGraphModel("https://raw.githubusercontent.com/hugozanini/TFJS-object-detection/master/models/kangaroo-detector/model.json");
  return model;
}

const threshold = 0.25;

let classesDir = {
  1: {
    name: "Kangaroo",
    id: 1,
  },
  2: {
    name: "Other",
    id: 2,
  },
};

//Called when file is uploaded
function upload(event) {
  //Compatible file types
  const imageTypes = ["png", "jpg", "jpeg"];
  const videoTypes = ["mp4", "mkv", "wmv", "mov"];

  var videoSrc = document.getElementById("video-source");
  var videoTag = document.getElementById("videoPreview");
  var imgTag = document.getElementById("imagePreview");

  //Checks if a file is uploaded
  if (event.target.files && event.target.files[0]) {
    var extension = event.target.files[0].name.split(".").pop().toLowerCase();
    var reader = new FileReader();

    //If file is image
    if (imageTypes.includes(extension)) {
      reader.onload = function (e) {
        imgTag.src = e.target.result;
      }.bind(this);
      imgTag.style.display = "block";
      videoTag.style.display = "none";
      document.getElementById("upload-button").style.marginTop = "5px";
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
      var error = "Incompatible file type.\nCompatible file types:\n";
      error += imageTypes.join(", ") + ", " + videoTypes.join(", ");
      alert(error);
    }

    reader.readAsDataURL(event.target.files[0]);
  }
}

const drawRect = (detections, ctx) => {
  // Loop through each prediction
  detections.forEach((prediction) => {
    // Extract boxes and classes
    const [x, y, width, height] = prediction["bbox"];
    const text = prediction["class"];

    // Set styling
    const color = Math.floor(Math.random() * 16777215).toString(16);
    ctx.strokeStyle = "#" + color;
    ctx.font = "18px Arial";

    // Draw rectangles and text
    ctx.beginPath();
    ctx.fillStyle = "#" + color;
    ctx.fillText(text, x, y);
    ctx.rect(x, y, width, height);
    ctx.stroke();
  });
};

function Tracking() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // main loop
  const runModel = async () => {
    const model = await load_model();
    console.log("Model Loaded");

    // Loop and detect
    setInterval(() => {
      detect(model);
    }, 10);
  };

  const process_input = video_frame => {
    const tfimg = tf.browser.fromPixels(video_frame).toInt();
    const expandedimg = tfimg.transpose([0,1,2]).expandDims();
    return expandedimg;
  };

  const detect = async (model) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await model.predict(webcamRef.current.stream);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  useEffect(() => {
    runModel();
  }, []);

  return (
    <div className="container">
      <Header />
      <main id="mainContent">
        <Grid container>
          <Grid item xs={0} lg={1}>
            {/* spacer */}
          </Grid>
          <Grid item xs={12} lg={10}>
            <Subheader />
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
                    <Webcam ref={webcamRef} muted={true} id="trackCam" />
                    <canvas ref={canvasRef} id="trackCanvas" />
                  </Container>
                </Grid>
                <Grid item direction="column" justifyContent="center">
                  <Container>
                    <div id="divider" />
                  </Container>
                </Grid>
                <Grid item direction="column" justifyContent="center">
                  <Typography id="label-header" variant="h4">
                    Upload Image or Video
                  </Typography>
                  <Container id="uploadContainer">
                    <video
                      className={"preview"}
                      id="videoPreview"
                      controls
                      style={{ display: "none" }}
                    >
                      <source id="video-source" src="splashVideo" />
                      Your browser does not support HTML5 video.
                    </video>
                    <img
                      src="splashImage"
                      id="imagePreview"
                      className={"preview"}
                      style={{ display: "none" }}
                    />
                    <div id="center">
                      <label htmlFor="file-upload">
                        <Input
                          accept="Video/*,Image/*"
                          id="file-upload"
                          onChange={upload}
                          multiple
                          type="file"
                          value={""}
                          style={{ display: "none" }}
                        />
                        <Button
                          id="upload-button"
                          variant="contained"
                          color="primary"
                          component="span"
                          startIcon={<AddIcon />}
                          style={{ margin: "5px", marginTop: "100px" }}
                        >
                          Upload
                        </Button>
                      </label>
                    </div>
                  </Container>
                </Grid>
              </Grid>
            </div>
            <OptionPane />
            <ButtonGroup />
          </Grid>
          <Grid item xs={0} lg={1}>
            {/* spacer */}
          </Grid>
        </Grid>
      </main>
    </div>
  );
}

export default Tracking;
