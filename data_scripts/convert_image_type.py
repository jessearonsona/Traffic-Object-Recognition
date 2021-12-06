import glob
import xml.etree.ElementTree as ET
from pathlib import Path
import shutil
import sys
import os
import subprocess

def correct_xml():
    for file in glob.iglob('*.xml'):
        tree = ET.parse(file)
        root = tree.getroot()

        old_name = Path(root.find('filename').text)
        suffix = old_name.suffix


        name = str(Path(file).with_suffix(suffix))
        command = ['sed', '-i', f's/{old_name}/{name}/', file]
        subprocess.run(command)



def rename_to_numbers():
    i = 0
    for file in glob.iglob('*.xml'):
        tree = ET.parse(file)
        root = tree.getroot()
        image_file = Path(root.find('filename').text)
        suffix = image_file.suffix
        print(suffix)

        try:
            shutil.move(str(image_file), '{}{}'.format(i, suffix))
        except FileNotFoundError:
            print("Not Found, Skipping: '{}'".format(image_file), file=sys.stderr)
            continue
        shutil.move(file, '{}.xml'.format(i))

        i += 1
