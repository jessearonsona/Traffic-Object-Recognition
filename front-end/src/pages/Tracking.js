// TODO: 1) Add instruction for clicking/dragging tracking line
//       2) Auto-quit when time to run model has elapsed or when recorded video is complete
//       3) Components to show results for recorded video or still image with option to send to DB?

import React, { useCallback, useRef, useState, useEffect } from "react";
import { Button, Container, Grid, Input, Typography } from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import "../styling/TrackingAndConditions.css";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import OptionPane from "../components/OptionPane";
import { useLocation, useNavigate } from "react-router-dom";

const Tracking = () => {
    // Initialize state
    const videoRef = useRef()
    const [showWebcam, setShowWebcam] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const [road, setRoad] = useState("");
    const [reportTime, setReportTime] = useState("")
    const [duration, setDuration] = useState("")
    const [direction, setDirection] = useState("")
    const [line, setLine] = useState("")
    // Compatible file types
    const imageTypes = ["jpg", "jpeg", "png"]
    const videoTypes = ["mp4", "mkv", "wmv", "mov"]
    const [command, setCommand] = useState(null);
  const [accessToken, setAccessToken] = useState();

  const showAdminOption = localStorage.getItem("admin");

    function getTrackingCommand(){

        const path = " back-end\\Tracking\\";

        const model = " -m " + path + "saved_model";

        const label = " -l " + path + "four_class_label_map.pbtxt";

        const savePath = " -sp " + path + "saves\\output.avi";

        const threshold = " -t " + "0.2";

        const roiPosition = " -roi " + "0.5"; //TODO

        const reportFrequency = " -rf " + reportTime;

        const detectionDuration = " -d " + duration;

        const comm = "python" + path + "tensorflow_cumulative_object_counting.py" 
                + model + label + savePath + threshold + roiPosition;

        setCommand(comm)

    }

    // Validate and redirect to running page
    function start() {
        if (videoRef != null && validate()) {
            getTrackingCommand()
            /*
            navigate("/running", {
                state:
                    {
                        model: (location.pathname).substring(1), road: road, reportTime: reportTime,
                        duration: duration, direction: direction, line: line
                    }
            });
            */
        }
      }
  useEffect(() => {
      setAccessToken(localStorage.getItem("token"));
    }, [accessToken]
  );


  // Get all info from child components
  const getDuration = useCallback((data) => {
    setDuration(data);
  }, []);
  const getRoad = useCallback((data) => {
    setRoad(data);
  }, []);
  const getReportTime = useCallback((data) => {
    setReportTime(data);
  }, []);
  const getDirection = useCallback((data) => {
    setDirection(data);
  }, []);
  const getLine = useCallback((data) => {
    setLine(data);
  }, []);

  // Validate and redirect to running page
  function start() {
    if (videoRef != null && validate()) {
      navigate("/running", {
        state: {
          model: location.pathname.substring(1),
          road: road,
          reportTime: reportTime,
          duration: duration,
          direction: direction,
          line: line,
        },
      });
    }


  // Checks that all fields are filled in
  function validate() {
    if (duration === "" || isNaN(parseFloat(duration))) {
      return false;
    } else if (road === "") {
      return false;
    } else if (reportTime === "" || isNaN(parseFloat(reportTime))) {
      return false;
    } else if (direction === "") {
      return false;
    } else return !(line === "");

   // else {
    //  document.getElementById("missing-field").style.display = "block";
    //}
  }

  // Called when file is uploaded
  const upload = (event) => {
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
        videoTag.src = URL.createObjectURL(event.target.files[0]);
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
  };

  // Show webcam video
  function displayWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: true,
        })
        .then((stream) => {
          setShowWebcam(true);
          document.getElementById("cameraConnect").style.display = "none";
          videoRef.current.srcObject = stream;
        });
    }
  }

    const CommandComponent = () => {
      if (!command) {
        return (
          <code>Press start to display the correct python command</code>
        )
      }

      return (
        <code>{command}</code>
      )
    }

    return (
      <div className="container">
      <Header admin={showAdminOption} />
      <main id="mainContent">
        <Grid container>
          <Grid item lg={1}>
            {/* spacer */}
          </Grid>
          <Grid item xs={12} lg={10}>
            <Subheader getRoad={getRoad} authed={accessToken} />
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
                                      </label>
                                  </div>
                              </Container>
                          </Grid>
                      </Grid>
                  </div>
                  <CommandComponent />
                  <OptionPane getReportTime={getReportTime} getDuration={getDuration} getDirection={getDirection}
                              getLine={getLine}/>
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


export default Tracking;
