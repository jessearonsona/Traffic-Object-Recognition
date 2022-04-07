// TODO: Conditionally render OptionPane if Connect to camera is selected
import "../styling/TrackingAndConditions.css";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import ButtonGroup from "../components/ButtonsGroup";
import OptionPane from "../components/OptionPane";
import { Button, Container, Grid, Input, Typography } from "@material-ui/core";
import Webcam from "react-webcam";
import AddIcon from "@mui/icons-material/Add";

import * as tf from "@tensorflow/tfjs";

async function load_model() {
  // It's possible to load the model locally or from a repo
  // You can choose whatever IP and PORT you want in the "http://127.0.0.1:8080/model.json" just set it before in your https server
  const model = await tf.loadGraphModel("http://127.0.0.1:8080/model.json");
  return model;
}

const ROAD_CONDITIONS = {
  0: "Clear",
  1: "Ice",
  2: "Partial Snow",
  3: "Snow",
  4: "Wet"

};

const roadLabels = ['Clear', 'Ice', "Snow", "Partial Snow", "Wet"];

import { useState } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";


const Conditions = () => {
  const [showWebcam, setShowWebcam] = useState(false);
  //Compatible file types
  const imageTypes = ["jpg", "jpeg", "png"];
  const videoTypes = ["mp4", "mkv", "wmv", "mov"];
  //const model = tf.loadLayersModel()

  //Called when file is uploaded
  function upload(event) {
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
        //const model = load_model();
        //alert(model.summary());
        runModel(imgTag);
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



  //runs the model on a given image
  const runModel = async (test_image) => {
    const model = await load_model();
   
    //converting the image to a formatted tensor
    let tensor = tf.browser.fromPixels(test_image, 3)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()
    
    //feeding the image in. 
    let predictions = await model.predict(tensor).data();

    const evalOutput = model.evaluate




    console.log(predictions);

    let top5 = Array.from(predictions)
		.map(function (p, i) { // this is Array.map
			return {
				probability: p,
				className: ROAD_CONDITIONS[i] // we are selecting the value from the obj
			};
		}).sort(function (a, b) {
      console.log("b: " + b + b.probability)
			return b.probability - a.probability;
		}).slice(0, 5); //Determines how many of the top results it shows

    let output = "Predcitions: ";
    top5.forEach(function (p) {
        output += `${p.className}: ${p.probability.toFixed(6)}\n`; //probability is not probabilty atm. Need to fix
    });

      //console.log(top5); //showing our current prediction. This is what we need. 
      console.log(top5[0].className);
      console.log(output);
      console.log(predictions);
  }




  function displayWebcam() {
    setShowWebcam(true);
    document.getElementById("cameraConnect").style.display = "none";
  }

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
                        onClick={displayWebcam}
                        style={{ marginTop: "100px" }}
                      >
                        Connect
                      </Button>
                    </div>
                    {showWebcam && (
                      <Webcam
                        id="webcamVideo"
                        src=""
                        audio={false}
                        mirrored={true}
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
};

export default Conditions;
