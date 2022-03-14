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
  //const model = await loadGraphModel(
  //"https://raw.githubusercontent.com/hugozanini/TFJS-object-detection/master/models/kangaroo-detector/model.json"
  //);
  return model;
}

const threshold = 0.5;
// Kangaroo Map
//let classesDir = {
//1: {
//name: "Kangaroo",
//id: 1,
//},
//2: {
//name: "Other",
//id: 2,
//},
//};

// TODO: validate labels for 4 class model
let classesDir = {
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

class Tracking extends React.Component {
  videoRef = React.createRef();
  canvasRef = React.createRef();

  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
          },
        })
        .then((stream) => {
          window.stream = stream;
          this.videoRef.current.srcObject = stream;
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });

      const modelPromise = load_model();

      Promise.all([modelPromise, webCamPromise])
        .then((values) => {
          console.log("promise met");
          this.detectFrame(this.videoRef.current, values[0]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  detectFrame = (video, model) => {
    tf.engine().startScope();
    model.executeAsync(this.process_input(video)).then((predictions) => {
      this.renderPredictions(predictions, video);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
      tf.engine().endScope();
    });
  };

  process_input(video_frame) {
    const tfimg = tf.browser.fromPixels(video_frame).toInt();
    const expandedimg = tfimg.transpose([0, 1, 2]).expandDims();
    return expandedimg;
  }

  buildDetectedObjects(scores, threshold, boxes, classes, classesDir) {
    const detectionObjects = [];
    var video_frame = document.getElementById("webcamVideo");
    // DEBUG
    //console.log('classes')
    //console.log(classes)
    //console.log('boxes')
    //console.log(boxes)
    //console.log('scores')
    //console.log(scores)

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
      }
    });
    return detectionObjects;
  }

  renderPredictions = (predictions) => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    //Getting predictions

    // DEBUG
    //console.log('predictions')
    //console.log(predictions)

    console.log("predictions 0");
    console.log(predictions[0].arraySync());

    console.log("predictions 1");
    console.log(predictions[1].arraySync());

    console.log("predictions 2");
    console.log(predictions[2].arraySync());

    console.log("predictions 3");
    console.log(predictions[3].arraySync());

    console.log("predictions 4");
    console.log(predictions[4].arraySync());

    console.log("predictions 5");
    console.log(predictions[5].arraySync());

    console.log("predictions 6");
    console.log(predictions[6].arraySync());

    console.log("predictions 7");
    console.log(predictions[7].arraySync());

    // Kangaroo Model
    //const boxes = predictions[0].arraySync();
    //const scores = predictions[4].arraySync();
    //const classes = predictions[5].dataSync();

    // Car Model 4 classes
    const boxes = predictions[2].arraySync();
    // [4] could be scores [[float; 5]; 100]. [7] could be scores [float; 100]
    const scores = predictions[7].arraySync();
    // [5] is def classes
    const classes = predictions[5].dataSync();

    const detections = this.buildDetectedObjects(
      scores,
      threshold,
      boxes,
      classes,
      classesDir
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
      const textWidth = ctx.measureText(
        item["label"] + " " + (100 * item["score"]).toFixed(2) + "%"
      ).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    detections.forEach((item) => {
      const x = item["bbox"][0];
      const y = item["bbox"][1];

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(
        item["label"] + " " + (100 * item["score"]).toFixed(2) + "%",
        x,
        y
      );
    });
  };

  // example
  //render() {
  //  return (
  //    <div>
  //      <h1>Real-Time Object Detection: Kangaroo</h1>
  //      <h3>MobileNetV2</h3>
  //      <video
  //        style={{ height: "600px", width: "500px" }}
  //        className="size"
  //        autoPlay
  //        playsInline
  //        muted
  //        ref={this.videoRef}
  //        width="600"
  //        height="500"
  //        id="webcamVideo"
  //      />
  //      <canvas
  //        className="size"
  //        ref={this.canvasRef}
  //        width="600"
  //        height="500"
  //      />
  //    </div>
  //  );
  //}

  render() {
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
                      {/*
                        <Webcam ref={webcamRef} muted={true} id="trackCam" />
                        <canvas ref={canvasRef} id="trackCanvas" />
                      */}
                      <div style={{ position: "relative", top: 0, left: 0 }}>
                        <video
                          style={{ height: "600px", width: "500px" }}
                          className="size"
                          autoPlay
                          playsInline
                          muted
                          ref={this.videoRef}
                          width="600"
                          height="500"
                          id="webcamVideo"
                        />
                        <canvas
                          className="size"
                          ref={this.canvasRef}
                          width="600"
                          height="500"
                        />
                      </div>
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
}

export default Tracking;
