import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'    # Suppress TensorFlow logging (1)
import pathlib
import random
import tensorflow as tf
import time
from object_detection.utils import label_map_util
from object_detection.utils import config_util
from object_detection.utils import visualization_utils as viz_utils
from object_detection.builders import model_builder

# IMAGE_PATHS = [str(path) for path in os.listdir('./images/single_class_labels/train') if 'xml' not in path]
# IMAGE_PATHS = IMAGE_PATHS[0:4]
# IMAGE_PATHS = [
    # "./images/single_class_labels/train/210924153113.png",
    # "./images/single_class_labels/train/210924152421.png",
    # "./images/single_class_labels/train/210924152503.png",
    # "./images/single_class_labels/train/210924152521.png",
    # "./images/single_class_labels/test/210924152042.png",
    # "./images/single_class_labels/test/210924152059.png",
    # "./images/single_class_labels/test/210924152042.png",
    # "./images/single_class_labels/test/210924152209.png",
# ]
# IMAGE_PATHS = list(map(lambda p: f"./images/four-classes-x3/test/{p}",
#                   filter(lambda x: 'xml' not in x,
#                           os.listdir("images/four-classes-x3/test")
#                       )))
IMAGE_PATHS = list(map(lambda p: f"../test-split-video/images/0/{p}",
                  filter(lambda x: 'xml' not in x,
                          os.listdir("../test-split-video/images/0")
                      )))
seen = []

PATH_TO_LABELS = './data/four-class-map-x3.pbtxt'
PATH_TO_CFG = "./exported_models/four-class-x3/pipeline.config"
PATH_TO_CKPT = "./exported_models/four-class-x3/checkpoint"

print('Loading model... ', end='')
start_time = time.time()

# Load pipeline config and build a detection model
configs = config_util.get_configs_from_pipeline_file(PATH_TO_CFG)
model_config = configs['model']
detection_model = model_builder.build(model_config=model_config, is_training=False)

# Restore checkpoint
ckpt = tf.compat.v2.train.Checkpoint(model=detection_model)
ckpt.restore(os.path.join(PATH_TO_CKPT, 'ckpt-0')).expect_partial()


@tf.function
def detect_fn(image):
    """Detect objects in image."""

    image, shapes = detection_model.preprocess(image)
    prediction_dict = detection_model.predict(image, shapes)
    detections = detection_model.postprocess(prediction_dict, shapes)

    return detections, prediction_dict, tf.reshape(shapes, [-1])

end_time = time.time()
elapsed_time = end_time - start_time
print('Done! Took {} seconds'.format(elapsed_time))


category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS, use_display_name=True)


import numpy as np
import cv2
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')   # Suppress Matplotlib warnings

def load_image_into_numpy_array(path):
    """Load an image from file into a numpy array.

    Puts image into numpy array to feed into tensorflow graph.
    Note that by convention we put it into a numpy array with shape
    (height, width, channels), where channels=3 for RGB.

    Args:
      path: the file path to the image

    Returns:
      uint8 numpy array with shape (img_height, img_width, 3)
    """
    return np.array(cv2.imread(path))


for image_path in IMAGE_PATHS:

    print('Running inference for {}... '.format(image_path))

    image_np = cv2.imread(image_path)


    input_tensor = tf.convert_to_tensor(np.expand_dims(image_np, 0), dtype=tf.float32)

    detections, predictions_dict, shapes = detect_fn(input_tensor)

    label_id_offset = 1
    image_np_with_detections = image_np.copy()

    viz_utils.visualize_boxes_and_labels_on_image_array(
          image_np_with_detections,
          detections['detection_boxes'][0].numpy(),
          (detections['detection_classes'][0].numpy() + label_id_offset).astype(int),
          detections['detection_scores'][0].numpy(),
          category_index,
          line_thickness=10,
          use_normalized_coordinates=True,
          max_boxes_to_draw=200,
          min_score_thresh=.4,
          agnostic_mode=False)

    cv2.imshow('object detection', cv2.resize(image_np_with_detections, (1200, 1000)))

    while True:
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

cv2.destroyAllWindows()
