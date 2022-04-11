/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
//                                       CODE FROM CODING WITH KEVIN SQL SERVER TUTORIAL                                          //

const path = require("path");
const express = require("express");
const cors = require("cors");
const dbOperations = require("./dbFiles/dbOperations");
const User = require("./dbFiles/userModel");
const userRoutes = require("./routes/userRoutes");
// const bodyParser = require("body-parser");
// const userRoutes = require("./routes/userRoutes");
// const dboperations = require("./config/dboperations");
// const db = require("./config/dboperations");
// const User = require("./models/users");
// const { response } = require("express");
// const connectDatabase = require("./config/dbconnect");

const app = express();
// const router = express.Router();
// // connectDatabase();
app.use(express.urlencoded());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Cross Origin Resource Sharing
// can create a whitelist of domains that are allowed to access the server if desired
app.use(cors());
// app.use("/", router);

// // THIS IS WHERE WE WOULD PERFORM THE AUTHENTICATION, AUTHORIZATION, AND LOGGING???
// // IT WOULD BE CALLED BEFORE ANY OTHER ROUTE WOULD BE USED HE SAYS
// router.use((request, response, next) => {
//   console.log("middleware");
//   next();
// });

// router.route("/users").get((req, res) => {
//   dboperations.getUsers().then((result) => {
//     // console.log(result);
//     res.json(result[0]);
//   });
// });

// router.route("/users/:email").get((req, res) => {
//   dboperations.getSingleUser(req.params.email).then((result) => {
//     // console.log(result);
//     res.json(result[0]);
//   });
// });

// router.route("/users").post((req, res) => {
//   let user = { ...req.body };

//   dboperations.addUser(user).then((result) => {
//     // console.log(result);
//     res.status(201).json(result);
//   });
// });

// Built-in Middleware
// allows getting submitted form data as a parameter
app.use(express.urlencoded({ extended: false }));
// allows getting submitted json data
app.use(express.json());
// I DON'T THINK I NEED THESE////////////////////////////////////////////////////////////////////////////
// app.use(express.static(path.join(__dirname, "/public")));
// Custom Middleware
// Request Logger
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// })
/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use("/users", userRoutes);

// Route Handlers To Manage User Data
// Get All Users
app.get("/api/users", async (req, res) => {
  const result = await dbOperations.getUsers();
  res.send(result.recordset);
});

// Register New User
app.post("/api/users", async (req, res) => {
  const result = await dbOperations.addUser(req.body);
  res.send(result);
});

// Change Admin Status
app.put("/api/users/:id", async (req, res) => {
  const result = await dbOperations.changeAdminStatus(req.body);
  res.send(result);
});

// Delete a User
app.delete("/api/users/:id", async (req, res) => {
  const result = await dbOperations.changeAdminStatus(req.body);
  res.send(result);
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Need to create new dbOperations for these
app.get("/api/login", async (req, res) => {
  const result = await dbOperations.getUsers();
  res.send(result.recordset);
});

app.post("/api/login", async (req, res) => {
  const result = await dbOperations.loginUser(req.body);
  res.send(result);
  // const email = req.body.User_Email;
  // const password = req.body.User_Password;

  // db.query(
  //   "SELECT * FROM users WHERE User_Email = ?;",
  //   email,
  //   (err, result) => {
  //     if (err) {
  //       res.send({ err: err });
  //     }

  //     if (result.length > 0) {
  //       bcrypt.compare(password, result[0].User_Password, (error, response) => {
  //         if (response) {
  //           req.session.user = result;
  //           console.log(req.session.user);
  //           res.send(result);
  //         } else {
  //           res.send({ message: "Wrong username/password combination!" });
  //         }
  //       });
  //     } else {
  //       res.send({ message: "User doesn't exist" });
  //     }
  //   }
  // );
});
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// let Emily = new User(4444, "Emily Aqueda", "eaqueda@ndsu.edu", "abcd", 0);
// console.log(Emily);

// dbOperations.getUsers("/api/users").then((res) => {
//   console.log(res.recordset);
// });

// dbOperations.addUser(Emily);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
