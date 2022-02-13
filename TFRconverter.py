import os  # used for directory operations
import tensorflow as tf
from PIL import Image  # used to read images from directory

# my file path, just like the picture above
cwd = r"C:\Users\Jesse\Desktop\School Stuff\Comp Sci\Senior Project\testing"
# the tfrecord file path, you need to create the folder yourself
recordPath = r"C:\Users\Jesse\Desktop\School Stuff\Comp Sci\Senior Project\tfrecord"
# the best number of images stored in each tfrecord file
bestNum = 1000
# the index of images flowing into each tfrecord file
num = 0
# the index of the tfrecord file
recordFileNum = 0
# the number of classes of images
#keys = [str(i) for i in list(range(10))]
keys = [str(i) for i in os.listdir(cwd)]
values = [i for i in list(range(len(keys)))]
classes = dict(zip(keys, values))
# name format of the tfrecord files
recordFileName = ("train.tfrecords-%.3d" % recordFileNum)
recordTestName = ("test.tfrecords-%.3d" % recordFileNum)
# tfrecord file writer
writerTrain = tf.io.TFRecordWriter(recordPath + recordFileName)
writerTest = tf.io.TFRecordWriter(recordPath + recordTestName)
numImages = 0
fileImages = 0

print("Creating the 000 tfrecord file")
for name, label in classes.items():
    writer = tf.io.TFRecordWriter(recordPath + recordFileName)
    print(name)
    print(label)
    class_path = os.path.join(cwd, name)
    fileImages = len(os.listdir(class_path)) * .8
    numImages = 0
    print(fileImages)
    for img_name in os.listdir(class_path):
        num += 1
        numImages += 1
        if num > bestNum:
            num = 1
            recordFileNum += 1
            writer = tf.io.TFRecordWriter(recordPath + recordFileNum)
            print("Creating the %.3d tfrecord file" % recordFileNum)
        img_path = os.path.join(class_path, img_name)
        img = Image.open(img_path, "r")
        img_raw = img.tobytes()
        #if numImages > fileImages:
            #exampleTest = tf.train.Example(features=tf.train.Features(feature={
#"img_raw": tf.train.Feature(bytes_list=tf.train.BytesList(value=[img_raw])),
#"label": tf.train.Feature(int64_list=tf.train.Int64List(value=[label]))}))
 #       elif numImages < fileImages:
exampleTrain = tf.train.Example(features=tf.train.Features(feature={
"img_raw": tf.train.Feature(bytes_list=tf.train.BytesList(value=[img_raw])),
"label": tf.train.Feature(int64_list=tf.train.Int64List(value=[label]))}))
writerTrain.write(exampleTrain.SerializeToString())
#writerTest.write(exampleTest.SerializeToString())
print(recordPath)
writerTrain.close()
#writerTest.close()

