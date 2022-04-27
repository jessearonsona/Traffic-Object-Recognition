Using Conditions Page: 

The Conditions page and its connected Running page both use a hosted tensorflowJS model. It loads this model through a given URL.
The buttons at the bottom of the conditions as well as the insert fields can be used to change how the reports are generated on the running page.

Buttons: 
Minimum time between photos: Done in Minutes. Deteremines how often pictures are taken and classified and put into the report.
***DO NOT GO PAST 1 DECIMAL PLACES(.x) THIS CAN INTRODUCE MILLISECONDS AND WILL RESULT IN THE PICTURES NEVER BEING TAKEN

Duration of Detection: Done in Hours. Determines the length the detection will run on live video till it stops itself, can be stopped early.
***DO NOT GO PAST 2 DECIMAL PLACES(.xx) THIS CAN INTRODUCE MILLISECONDS AND WILL RESULT IN THE DURATION BEING INFINITE

Potential Updates: 
Make the Load Model Function Reusable. Currently you would need to change both functions if you changed the point from which you wanted to load the model.
Make the Road Conditions Array Reusable. Currently to add new road conditions you would have to update both of the arrays within the two pages. 