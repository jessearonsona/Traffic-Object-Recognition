"# Trafic-Object-Recognition" 

## To start the Road Condition Model
Open a terminal in the project directory, navigate to the back-end folder then models then road-conditions and run:
### 'http-server -c1 --cors . '
This command hosts the model for the website to grab


## Diagrams depicting the flow of the web app are located in the web-app-diagrams folder (made with draw.io and can be viewed in VS Code by installing the draw.io extension)


## RUNNING THE WEB APP:
The backend uses Node JS and Express JS 
## To run the backend
Open a terminal. In the project directory, navigate to the back-end folder and run:
### `npm ci` (stands for "clean install" - this will install all the dependencies from the package-lock.json)
### `npm start` (runs the server in development on [http://localhost:5000])

## To run the front end:
Open a second terminal.  In the project directory, navigate to the front-end folder and run:
### `npm ci` (this will install all the dependencies from the package-lock.json)
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


## WEB-APP SETTINGS TO CHANGE WHEN MOVING FROM DEV TO PROD
## Front end:
In package.json:
    - proxy currently set to http://127.0.0.1:5000 (to avoid a CORS error)
## Back end:
In .env
    - Express config values are currently set for local host, change these to match the server the back end will run on

In dbFiles/dbConfig.js
    - values currently set to run a local SQL Server database, change these to match UGPTI's database (tables in the test database were setup to be identical to those in UGPTI's Traffic Recognition database)

In server.js
    - access token is generated in the user login route, expiration currently set to 1 day 


## NOTES ABOUT THE DATABASE OPERATIONS
In dbFiles/dbOperations.js
    - getUsers() retrieves all registered users and the query currently orders them alphabetically by first name

    - addUser() adds a new user to the database contains code to hash the password prior to storing it.  This code is currently commented out because it cannot be decoded for display on the admin page (as there is no way to decrypt it after it has been hashed)
