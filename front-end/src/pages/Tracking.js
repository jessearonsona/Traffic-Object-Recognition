// TODO: 1) Add Connect to camera button
//       2) Conditionally render OptionPane if Connect to camera is selected
//          (tracking and direction options only if recorded video is selected, none if image is selected)
//       3) Add instruction for clicking/dragging tracking line
//       4) Auto-quit when time to run model has elapsed or when recorded video is complete
//       5) Components to show results for recorded video or still image with option to send to DB?

import React from "react";
import { Button, Container, Grid, Input, Typography } from "@material-ui/core";
import { loadGraphModel } from "@tensorflow/tfjs-converter";

import AddIcon from "@mui/icons-material/Add";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import * as tf from "@tensorflow/tfjs";
import { VideoCorrelationTracker } from "dlib-correlation-tracker-js";

import "../styling/TrackingAndConditions.css";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import ButtonGroup from "../components/ButtonsGroup";
import OptionPane from "../components/OptionPane";

tf.setBackend("webgl");

const load_model = async () => {
  // It's possible to load the model locally or from a repo
  // You can choose whatever IP and PORT you want in the "http://127.0.0.1:8080/model.json" just set it before in your https server
  const model = await loadGraphModel("http://127.0.0.1:8080/model.json");
  //const model = await loadGraphModel(
  //"https://raw.githubusercontent.com/hugozanini/TFJS-object-detection/master/models/kangaroo-detector/model.json"
  //);

  return model;
};

const threshold = 0.5;
const framesToTrack = 20;

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

class Tracking extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.canvasRef = React.createRef();

    this.imageTypes = ["jpg", "jpeg", "png"];
    this.videoTypes = ["mp4", "mkv", "wmv", "mov"];

    this.state = {
      showWebcam: false,
      upCount: 0,
      sideCount: 0,
      frame: 0,
      trackers: [],
    };
  }

  //Called when file is uploaded
  upload(event) {
    var videoSrc = document.getElementById("video-source");
    var videoTag = document.getElementById("videoPreview");
    var imgTag = document.getElementById("imagePreview");

    //Checks if a file is uploaded
    if (event.target.files && event.target.files[0]) {
      var extension = event.target.files[0].name.split(".").pop().toLowerCase();
      var reader = new FileReader();

      //If file is image
      if (this.imageTypes.includes(extension)) {
        reader.onload = function (e) {
          imgTag.src = e.target.result;
        }.bind(this);
        imgTag.style.display = "block";
        videoTag.style.display = "none";
        document.getElementById("upload-button").style.marginTop = "5px";
      }

      //If file is video
      else if (this.videoTypes.includes(extension)) {
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
        error += this.imageTypes.join(", ") + ", " + this.videoTypes.join(", ");
        alert(error);
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  displayWebcam = () => {
    this.setState({ showWebcam: true });
    document.getElementById("cameraConnect").style.display = "none";
    this.runModelDetections();
  };

  runModelDetections = () => {
    console.log("Initiating Tracking Loop");
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

      console.log("Awaiting webcam and model...");
      Promise.all([modelPromise, webCamPromise])
        .then((values) => {
          console.log("Model and webcam loaded");
          this.setCanvasPosition();
          this.detectFrame(this.videoRef.current, values[0]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  setCanvasPosition = () => {
    let rect = this.videoRef.current.getBoundingClientRect();
    let ref = this.canvasRef.current;

    ref.width = rect.width;
    ref.height = rect.height;
    ref.className = "canvas";
  };

  buildTrackersFromDetections = (detections) => {
    let trackers = [];
    detections.forEach((obj) => {
      trackers.push({
        tracker: VideoCorrelationTracker(this.videoRef, {
          x: obj.bbox[0],
          y: obj.bbox[1],
          width: obj.bbox[2],
          height: obj.bbox[3],
        }),
        label: obj.class,
      });
    });
    return trackers;
  };

  updateTrackers = () => {
    let trackers = [];
    self.state.trackers.forEach((tracker) => {
      // get prediction and update tracker
      const { x, y, width, height } = tracker.tracker.predict;

      // render predictions
      this.renderBox({ x, y, width, height }, tracker.class);

      // if prediciton is Out of bounds remove it

      // if prediction cross ROI update ROI count
    });

    // set updated trackers
    self.setState({ trackers: trackers });
  };

  renderTrackers = (trackers) => {
    // TODO Render trackers
  };

  detectFrame = (video, model) => {
    requestAnimationFrame(() => {
      this.detectFrame(video, model);
    });

    // MAX FRAMES
    if (this.state.frame == 500) {
      requestAnimationFrame(() => {});
      return;
    }

    this.setState({ frame: (this.state.frame + 1) % framesToTrack });

    if (this.state.frame % framesToTrack == 0) {
      console.log("Detecting Frame");
      // Run Detection

      tf.engine().startScope();
      model.executeAsync(this.process_input(video)).then((predictions) => {
        let detections = this.getDetectionsFromPredictions(predictions);
        this.renderDetections(detections);

        let new_trackers = this.buildTrackersFromDetections(detections);
        this.setState({ trackers: this.trackers.concat(new_trackers) });
      });
      tf.engine().endScope();
    } else {
      // Perform Tracking
      console.log("Tracking Frame");
    }

    this.renderTrackers(this.state.trackers);
  };

  process_input(video_frame) {
    const tfimg = tf.browser.fromPixels(video_frame).toInt();
    const expandedimg = tfimg.transpose([0, 1, 2]).expandDims();
    return expandedimg;
  }

  buildDetectedObjects(scores, threshold, boxes, classes, classesDir) {
    const detectionObjects = [];
    var video_frame = document.getElementById("webcamVideo");

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
        console.log(bbox);
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

  getDetectionsFromPredictions = (predictions) => {
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

    return detections;
  };

  renderDetections = (detections) => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

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

  render = () => {
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
                      <div id="cameraConnect">
                        <Button
                          id="connect-button"
                          variant="contained"
                          color="primary"
                          component="span"
                          startIcon={<CameraAltIcon />}
                          onClick={this.displayWebcam}
                          style={{ marginTop: "100px" }}
                        >
                          Connect
                        </Button>
                      </div>
                      {this.state.showWebcam && (
                        <div className="trackerContainer">
                          <video
                            id="webcamVideo"
                            className="trackerVideo"
                            autoPlay
                            playsInLine
                            muted
                            ref={this.videoRef}
                          />
                          <canvas classname="canvas" ref={this.canvasRef} />
                        </div>
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
                      <div id="divider" />
                    </Container>
                  </Grid>
                  <Grid item direction="column" justifyContent="center">
                    <Container>
                      <div id="dividerHorizontal" />
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
                          <source id="video-source" src="splashVideo" />
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
                            onChange={this.upload}
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
  };
}

export default Tracking;
