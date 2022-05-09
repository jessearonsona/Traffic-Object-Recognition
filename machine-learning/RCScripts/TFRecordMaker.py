import os  # used for directory operations
import tensorflow as tf
from PIL import Image  # used to read images from directory
import argparse
from dataclasses import dataclass
from os import path




@dataclass
class Args:
    data_dir: str
    output_dir: str

    def get_args():
        parser = argparse.ArgumentParser()
        parser.add_argument("--data_dir")
        parser.add_argument("--output_dir")

        args = parser.parse_args()

        return Args(args.data_dir, args.output_dir)


def split_dataset(args: Args, classes: dict):
    train_set = {}
    test_set = {}

    for name in classes.keys():
        # Ex: data/ice/
        image_names = [path.join(args.data_dir, name, filename) for filename in os.listdir(path.join(args.data_dir, name))]

        split_point = int(len(image_names) * .8)

        train_images = image_names[:split_point]
        test_images = image_names[split_point:]

        train_set[name] = train_images
        test_set[name] = test_images

    print(train_set)
    print()
    print(test_set)
    return train_set, test_set


def image_feature(value):
    """Returns a bytes_list from a string / byte."""
    return tf.train.Feature(
        bytes_list=tf.train.BytesList(value=[tf.io.encode_jpeg(value).numpy()])
    )


def label_feature(label):
    return tf.train.Feature(int64_list=tf.train.Int64List(value=[label]))


def create_example(label, example):
    feature = {
        "image": image_feature(example),
        "label": label_feature(label),
    }

    return tf.train.Example(features=tf.train.Features(feature=feature))


def generate_tf_record(input_set: dict, output_name: str):
    with tf.io.TFRecordWriter(
        output_name
    ) as writer:
        for label_name, image_list in input_set.items():
            for image_path in image_list:
                image = tf.io.decode_raw(Image.open(image_path, 'r').tobytes(), tf.uint8)
                example = create_example(label_name, image)

                writer.write(example.SerializeToString())


def get_class_labels(data_dir):
    keys = [str(i) for i in os.listdir(data_dir)]
    values = [i for i in list(range(len(keys)))]
    return dict(zip(keys, values))


def main():
    args = Args.get_args()
    #args = Args(r"Location of folders containint images. Folders should be named their label", r"location to save record to") #Use this if you want to run in an IDE rather than the termianl
    classes = get_class_labels(args.data_dir)

    train_set, test_set = split_dataset(args, classes)

    generate_tf_record(train_set, "train.tfrecord")
    generate_tf_record(test_set, "test.tfrecord")






if __name__ == '__main__':
    main()