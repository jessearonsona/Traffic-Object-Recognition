import glob
import re
import argparse


def main():
    parser = argparse.ArgumentParser()
    parser.usage = "python path/to/count_classes.py"
    parser.description =  "Count class frequencies in xml files of the current directory."
    parser.add_argument(
            "-s", 
            "--sort-by-class", 
            action='store_true', 
            help="Use when the counting class1-13 classes to sort the classes in numerical order. Otherwise they will be sorted with the highest frequency at the top."
    )
    args = parser.parse_args()

    # sort_by_class = args.sort_by_class is not None and args.sort_by_class.lower() == 'true'
    sort_by_class = args.sort_by_class


    classes = {}

    for file in glob.iglob('*.xml'):
        with open(file) as f:
            text = f.read()
            pattern = "<name>(\\w+)</name>"
            results = re.findall(pattern, text)
            if results is None:
                continue

            for match in results:
                if match in classes.keys():
                    classes[match] += 1
                else:
                    classes[match] = 1

    report = []
    if sort_by_class:
        for k, v in classes.items():
            n = int(k[5:])
            report.append(( n, k, v ))
            
        report.sort(reverse=False)
        for x in report:
            print("%8s: %5d" % (x[1], x[2]))
    else:
        for k, v in classes.items():
            report.append((v, k))

        report.sort(reverse=True)
        for x in report:
            print("%8s: %5d" % (x[1], x[0]))


if __name__ == '__main__':
    main()
