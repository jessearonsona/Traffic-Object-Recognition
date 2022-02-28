import Header from "../components/Header";
import "../styling/Home.css";
import {Button, Container, Grid, Input, Typography} from "@material-ui/core";
import Webcam from "react-webcam";
import React from "react";
import AddIcon from '@mui/icons-material/Add';

const Home = () => {

    //Compatible file types
    const imageTypes = ['jpg', 'jpeg', 'png'];
    const videoTypes = ['mp4', 'mkv', 'wmv', 'mov'];

    //Called when file is uploaded
    function upload(event)
    {
        var videoSrc = document.getElementById("video-source");
        var videoTag = document.getElementById("videoPreview");
        var imgTag = document.getElementById("imagePreview");

        //Checks if a file is uploaded
        if (event.target.files && event.target.files[0])
        {
            var extension = event.target.files[0].name.split('.').pop().toLowerCase();
            var reader = new FileReader();

            //If file is image
            if (imageTypes.includes(extension))
            {
                reader.onload = function(e) {
                  imgTag.src = e.target.result;
                }.bind(this)
                imgTag.style.display = "block";
                videoTag.style.display = "none";
                document.getElementById("upload-button").style.marginTop = "5px";
            }

            //If file is video
            else if (videoTypes.includes(extension))
            {
                reader.onload = function(e) {
                  videoSrc.src = e.target.result;
                  videoTag.load();
                }.bind(this)
                videoTag.style.display = "block";
                imgTag.style.display = "none";
                document.getElementById("upload-button").style.marginTop = "5px";
            }

            //Incompatible type
            else
            {
                var error = "Incompatible file type.\nCompatible file types:\n";
                error += imageTypes.join(", ") + ", " + videoTypes.join(", ");
                alert(error);
            }

            reader.readAsDataURL(event.target.files[0]);
        }
    }
  return (
    <div className="container">
      <Header />
      <main id="mainContent">
        <div className="center">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
                <Grid
                    item
                    direction="column"
                    justifyContent="center"
                >
                    <Container>
                        <Typography id="label-header" variant="h4">
                            Live Camera
                        </Typography>
                        <Webcam id="webcamVideo" audio={false} mirrored={true}/>
                    </Container>
                </Grid>
                <Grid
                  item
                  direction="column"
                  justifyContent="center"
                >
                    <Container>
                        <div id="divider" />
                    </Container>
                </Grid>
                <Grid
                  item
                  direction="column"
                  justifyContent="center"
                >
                    <Typography id="label-header" variant="h4">
                        Upload Image or Video
                    </Typography>
                    <Container id="uploadContainer">
                        <video className={"preview"} id="videoPreview" controls style={{display: 'none'}}>
                            <source id="video-source" src="splashVideo" />
                            Your browser does not support HTML5 video.
                        </video>
                        <img src="splashImage" id="imagePreview" className={"preview"} style={{display: 'none'}} />
                        <div id="center">
                            <label htmlFor="file-upload">
                                <Input accept="Video/*,Image/*" id="file-upload" onChange={upload} multiple type="file" value={""} style={{display:'none'}} />
                                <Button id="upload-button" variant="contained" color="primary" component="span" startIcon={<AddIcon />} style={{margin: "5px", marginTop: "100px"}}>
                                    Upload
                                </Button>
                            </label>
                        </div>
                    </Container>
                </Grid>
            </Grid>
        </div>
      </main>
    </div>
  );
};

export default Home;