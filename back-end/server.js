const express = require("express");
const app = express();
const cors = require("cors");
const dbOperations = require("./dbFiles/dbOperations");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(express.urlencoded());
app.use(express.json());

// Cross Origin Resource Sharing
// can add a whitelist of domains that are allowed to access the server if desired
app.use(cors());

// BUILT-IN MIDDLEWARE
// allows getting submitted form data as a parameter
app.use(express.urlencoded({ extended: false }));
// allows getting submitted json data
app.use(express.json());

// ROUTE HANDLERS
// Route Handler to authorize user (Login):
app.post("/api/login", async (req, res) => {
  const { User_Email, User_Password } = req.body;

  const result = await dbOperations.loginUser(User_Email, User_Password);
  if (result.recordset.length !== 0) {
    // create JSON web token
    const accessToken = jwt.sign(
      { email: result.recordset[0].User_Email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      name: result.recordset[0].User_Name,
      email: result.recordset[0].User_Email,
      isAdmin: result.recordset[0].User_IsAdmin,
      accessToken: accessToken,
    });
  } else {
    res.status(401).send("Invalid email or password!");
  }
});

// Route Handlers to retrieve data:
// Get all users
app.get("/api/users", async (req, res) => {
  const result = await dbOperations.getUsers();
  res.json(result.recordset);
});

// Get all roads/intersections with cameras
app.get("/api/roads", async (req, res) => {
  const result = await dbOperations.getRoads();
  res.json(result.recordset);
});

// Get user password
app.post("/api/password/:id", async (req, res) => {
  const result = await dbOperations.getPassword(req.body);
  res.json(result.recordset);
});

// Route Handlers to manage user info:
// Register new user
app.post("/api/users", async (req, res) => {
  const result = await dbOperations.addUser(req.body);
  res.send(result);
});

// Change admin status
app.put("/api/users/:id", async (req, res) => {
  const result = await dbOperations.changeAdminStatus(req.body);
  res.send(result);
});

// Change user password
app.put("/api/password/:id", async (req, res) => {
  const result = await dbOperations.changePassword(req.body);
  res.send(result);
});

// Delete a user
app.post("/api/users/:id", async (req, res) => {
  const result = await dbOperations.deleteUser(req.body);
  res.send(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
