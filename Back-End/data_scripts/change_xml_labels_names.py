import os

passenger = ['class1', 'class2', 'class3']
busses = ['class4', 'class5']
truck = ['class6', 'class7', 'class8', 'class9', 'class10']
multi_unit = ['class11', 'class12', 'class13']

for categ in passenger:
    cmd = f"sed -i 's/{categ}/passenger/g' *.xml"
    print(cmd)

for categ in busses:
    cmd = f"sed -i 's/{categ}/bus/g' *.xml"
    print(cmd)

for categ in truck:
    cmd = f"sed -i 's/{categ}/truck/g' *.xml"
    print(cmd)

for categ in multi_unit:
    cmd = f"sed -i 's/{categ}/multi/g' *.xml"
    print(cmd)

