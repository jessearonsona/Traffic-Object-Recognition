# This script is used to apply transfer learning to a given pretrained model and then save the resulting model after a single training session
# Takes in args of the location of the traiing dataset, validation dataset, model(can be file location or link), and desired save location

from dataclasses import dataclass
import glob
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import matplotlib.pyplot as plt
import argparse

from tensorflow.keras import layers

import logging
logger = tf.get_logger()
logger.setLevel(logging.ERROR)

#global constants
batch_size = 32
image_size = 224
image_shape = [image_size, image_size]
num_tfr_classes = 2
num_conditions = 5
EPOCHS = 2
AUTOTUNE = tf.data.experimental.AUTOTUNE

#feature map is how the tfr records are saved. Such as here they are saved as an image in byte string and then their label as an int
feature_map = {
    "image": tf.io.FixedLenFeature([], tf.string),
    "label": tf.io.FixedLenFeature([], tf.int64),
}


#holds important arguements to be used
@dataclass
class Args:
    
    train_dir: str #train directory of TFRs
    val_dir: str #validation directory of TFRs
    model_loc: str #model link for loading up a new model to transfer learn
    save_loc: str #location for saving the model

    def get_args():
        parser = argparse.ArgumentParser()
        parser.add_argument("--train_dir", type = str)
        parser.add_argument("--val_dir")
        parser.add_argument("--model_loc")
        parser.add_argument("--save_loc")

        args = parser.parse_args()

        return Args(args.train_dir, args.val_dir, args.model_loc, args.save_loc)

# Function to load up the tfrecords to a usable dataset.
def load_records(args: Args):
    train_files = glob.glob(args.train_dir + '/*.*')
    train_list = list(range(len(train_files)))
    train_records = [train_files[index] for index in train_list]
    train_dataset = get_dataset(train_records)

    val_files = glob.glob(args.val_dir + '/*.*')
    val_list = list(range(len(val_files)))
    val_records = [val_files[index] for index in val_list]
    val_dataset = get_dataset(val_records)

    return train_dataset, val_dataset

# Function to decode the TFRecord files; returns a tuple with the image and the labels in multi-hot format
def read_tfrecord(example):
    example = tf.io.parse_single_example(example, feature_map)
    image = tf.io.decode_jpeg(example["image"], channels=3)
    image = tf.image.resize(image, image_shape)
    image = tf.cast(image, tf.float32) / 255.0
    label = tf.cast(example["label"], tf.int32) 

    return image, label

# Function that creates a TFRecord dataset and calls the function to decode it
def load_dataset(filenames):
    ignore_order = tf.data.Options()
    ignore_order.experimental_deterministic = False
    dataset = tf.data.TFRecordDataset(filenames)
    dataset = dataset.with_options(ignore_order)
    dataset = dataset.map(read_tfrecord)
    
    return dataset

# Function to random and return the dataset
def get_dataset(filenames):
    dataset = load_dataset(filenames)
    dataset = dataset.shuffle(100)
    dataset = dataset.prefetch(buffer_size=AUTOTUNE)
    dataset = dataset.batch(batch_size)
    
    return dataset

#Loads up the model using the given model location
def load_model(args: Args):
    feature_extractor = hub.KerasLayer(args.model_loc, input_shape=(image_size, image_size,3))
    model = tf.keras.Sequential([
        feature_extractor,
        layers.Dense(num_conditions)
    ])

    return model

#This function will plot the history of the accuray of the model on the training and validation test as well as the loss numbers
def plot_training(history):
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']

    loss = history.history['loss']
    val_loss = history.history['val_loss']

    epochs_range = range(EPOCHS)

    plt.figure(figsize=(8, 8))
    plt.subplot(1, 2, 1)
    plt.plot(epochs_range, acc, label='Training Accuracy')
    plt.plot(epochs_range, val_acc, label='Validation Accuracy')
    plt.legend(loc='lower right')
    plt.title('Training and Validation Accuracy')

    plt.subplot(1, 2, 2)
    plt.plot(epochs_range, loss, label='Training Loss')
    plt.plot(epochs_range, val_loss, label='Validation Loss')
    plt.legend(loc='upper right')
    plt.title('Training and Validation Loss')
    plt.show()

# Function to view the picture and the guess made by the model. Blue label is a correct guess, red label is an incorrect guess.
def view_guesses(model, val_dataset):
    image_batch, label_batch = next(iter(val_dataset))
    image_batch = image_batch.numpy()
    label_batch = label_batch.numpy()

    predicted_batch = model.predict(image_batch)
    predicted_batch = tf.squeeze(predicted_batch).numpy()
    predicted_ids = np.argmax(predicted_batch, axis=-1)
    predicted_class_names = list(map(class_id_to_name, predicted_ids))
    print('in guesses')

    plt.figure(figsize=(10,9))
    for n in range(30):
        plt.subplot(6,5,n+1)
        plt.imshow(image_batch[n])
        color = "blue" if predicted_ids[n] == label_batch[n] else "red"
        plt.title(predicted_class_names[n].title(), color=color)
        plt.axis('off')
        plt.suptitle("Model predictions (blue: correct, red: incorrect)")

# Function to convert models guesses to the strings associated with them. Used by other functions
def class_id_to_name(id: int) -> str:
  if id == 0:
    return 'clear'
  if id == 1:
    return 'ice'
  if id == 2:
    return 'partial snow'
  if id == 3:
    return 'snow'
  if id == 4:
    return 'wet'

def main():
    args = Args.get_args()
    #args = Args(r"train_loc", 
    #r"val_loc",
    #"https://tfhub.dev/google/imagenet/mobilenet_v2_075_224/classification/5", #best model from my tests
    #r"save_loc") #If you want to run this in an IDE enter this here and comment out the args.get_args
    train_set, val_set = load_records(args)
    print(args.model_loc)
    model = load_model(args)
    print(model.summary())
    model.compile(
        optimizer='adam',
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        metrics=['accuracy'])
    
    history = model.fit(train_set, epochs = EPOCHS, validation_data = val_set)

    plot_training(history)
    view_guesses(model, val_set)

    model.save(args.save_loc) #saves the model to the specified location

if __name__ == '__main__':
    main()

