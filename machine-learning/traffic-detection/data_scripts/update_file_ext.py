import glob
import shutil

ext = ".jpg.jpeg"
files = glob.glob("*" + ext)

for file in files:
    shutil.move(file, file[:-len(ext)] + '.jpeg')
