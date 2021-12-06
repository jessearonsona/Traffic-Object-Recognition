## Training Locally
1. Collect and label images. Label images with LabelImg tool.
2. With all the images and labels (xml files) in the same directory. Run the `data_scripts/split_dataset.py` to split images into test set and training set
	- This creats the `train` and `test` directories
4. In the directory with `train` and `test`, run the `data_scripts/xml_to_csv.py`.
	- This creates to new files. train-records.csv, and test-records.csv.
5. Now time to generate the `tf.record` files. Run `model_scripts/generate_tf_record.py --csv_input <csv_file> --output_path <file_path> --image_dir <train/test directory>`
6. Now edit the pipeline config so that it points to these newly generated tfrecrods
7. Run `model_scripts/model_main_tf2.py --model_dir <modeldir> --pipeline_config_path <path to pipeline.config file>`
8. Wait for training to finish
9. Optionally use `tensorboard` in the model training dir to view training process statisitics.
