#!/bin/python3
import random
import glob
import xml.etree.ElementTree as ET
from pathlib import Path
import shutil
import sys
import os
import subprocess

def copy_labeled_images_to_intermediate_directory():
    dir = os.listdir()
    file_names = []
    for file in dir:
        if ".xml" in file:
            file = file[:-4]
            file_names.append(file)
    try:
        os.makedirs("labeled")
    except FileExistsError:
        print("Directory: {} already exists".format("labeled"))
    for name in file_names:
        for file in dir:
            if name in file and '.xml' not in file:
                shutil.copy(file, "labeled")
                shutil.copy(f'{name}.xml', "labeled")


def split_data_set():
    files = []
    for xml in glob.iglob('*.xml'):
        tree = ET.parse(xml)
        root = tree.getroot()
        image = root.find('filename').text
        files.append((xml, image))


    random.shuffle(files)

    split=int(len(files) * 0.2)

    test_set = files[:split]
    train_set = files[split:]
    print(f"Number in Train: {len(train_set)}")
    print(f"Number in Test: {len(test_set)}")


    for xml, file in test_set:
        shutil.copy(xml, "test")
        shutil.copy(file, "test")

    for xml, file in train_set:
        shutil.copy(xml, "train")
        shutil.copy(file, "train")
    # dir = os.listdir()
    # file_names = []

    # for file in dir:
    #     if ".xml" in file:
    #         file_names.append(file[:-4])

    # random.shuffle(file_names)

    # split_loc = int(len(file_names) * .5)
    # test_set = file_names[:split_loc]
    # train_set = file_names[split_loc:]

    # for name in test_set:
    #     for file in glob.iglob("{}.*".format(name)):
    #         shutil.copy(file, "test")

    # for name in train_set:
    #     for file in glob.iglob("{}.*".format(name)):
    #         shutil.copy(file, "train")


def main():
    split_data_set()


if __name__ == "__main__":
    main()
