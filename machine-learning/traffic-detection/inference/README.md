## Object Detection Inference
In order to use the traffic detection model:

1. Train or Download the pretrained-model. (Training is described in Training.md step)
2. Run the `run_on_video.py` scripts located in the `model_scripts` directory.
	-. Since this mainly a developer facing script. You may have to edit the variable pointing to the target video file.

## Object Counting
1. Ensure the Object Counting API installed
	- .https://github.com/TannerGilbert/Tensorflow-2-Object-Counting
2. Run  `python3 tensorflow_cumulative_object_counting.py -m <saved_model_dir> -l ../four-class-map-x3.pbtxt -v <input_video> -roi .8 -t .1 -sp <output.mp4>`
