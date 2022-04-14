Requirements: tensorflow, python, matplotlib, numpy

This file does a quick explanation of the scripts found here for the RCmodel, including the parameters they take in, their outputs, and what they do. 

#create_RCModel.py
This script takes in 4 arguements and will run a single training session on a given pre-existing model, applying transfer learning,
before saving the model in a given location. This script can also be used for making a new model after each training session. 

Input Arguments: --train_dir, the directory of your training tensorflow records
--val_dir, the directory of your validation tensorflow records
--model_loc, the link or directory location of a model you wish to train/apply transfer learning to
--save_loc, the directory you wish for the model to be saved at after the training session is complete

Outputs: The model, post training process, will be saved at the given save location.


#train_RCModel.py
This scripts takes in 3 arguements and will run a single trainign session on a given model. After the training is done this script
will save the model post training over the model beforehand.

Input Arguments: --train_dir, the directory of your training tensorflow records
--val_dir, the directory of your validation tensorflow records
--model_loc, the link or directory location of a model you wish to train, will also be used to save the model

Outputs: The model, post training process, will be saved at the given model location, replacing the previous one. 
