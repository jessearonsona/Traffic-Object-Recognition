## Object Detection Inference
In order to use the traffic detection model:

1. Train or Download the pretrained-model. (Training is described in Training.md step)
2. Run the `run_on_video.py` scripts located in the `model_scripts` directory.
	-. Since this mainly a developer facing script. You may have to edit the variable pointing to the target video file.

## Object Counting
1. Ensure the Object Counting API installed
	- .https://github.com/TannerGilbert/Tensorflow-2-Object-Counting
2. Run  `python3 tensorflow_cumulative_object_counting.py -m <saved_model_dir> -l ../four-class-map-x3.pbtxt -v <input_video> -roi .8 -t .1 -sp <output.mp4>`

## NOTES ABOUT tensorflow_cumulative_object_counting.py
## List of arguments:
-m or --model               || type=str, required=True, help='Model Path'

-l or --labelmap            || type=str, required=True, help='Path to Labelmap'

-v or --video_path          || type=str, default='', help='Path to video. If None camera will be used'

-t or --threshold           || type=float, default=0.5, help='Detection threshold'

-r or --roi_position        || type=float, default=0.6, help='ROI Position (0-1)'

-l or --labels              || nargs='+', type=str, help='Label names to detect (default="all-labels")'

-a or --axis                || default=True, action="store_false", help='Axis for cumulative counting (default=x axis)'

-s or --skip_frames         || type=int, default=20, help='Number of frames to skip between using object detection model'

-s or --show                || default=True, action="store_false", help='Show output')

-s or --save_path           || type=str, default='', help='Path to save the output. If None output won\'t be saved'

-s or --report_path         || type=str, default='', help='Path to save the report. If None report won\'t be saved'

-r or --report_name         || type=str, default='report', help='Report name. If None the report will be named report'

-r or --report_frequency    || type=int, default=15, help='How often generate report. If None report will be generated every 15 minutes'

-d or --duration            || type=int, default=0, help='Duration of tracking. If None script must be stopped manually'
