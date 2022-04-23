import React from "react";
import "../styling/Admin.css";
import Header from "../components/Header";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PasswordIcon from "@mui/icons-material/Password";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Admin = () => {
  //Set states
  let [page, setPage] = React.useState(0);
  let [rowsPerPage, setRowsPerPage] = React.useState(10);
  let [editID, setEditID] = React.useState(-1);
  let [deletePopup, setDeletePopup] = React.useState(false);
  let [passwordPopup, setPasswordPopup] = React.useState(false);
  let [errorPopup, setErrorPopup] = React.useState(false);
  let [newUserPopup, setNewUserPopup] = React.useState(false);
  let [toUserPopup, setToUserPopup] = React.useState(false);
  let [toAdminPopup, setToAdminPopup] = React.useState(false);

  // Set states for register new user fields
  const [userId, setUserId] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isAdmin, setIsAdmin] = useState();

  const [errMsg, setErrMsg] = useState();

  // Set states for data to populate user table and password dialog
  const [userData, setUserData] = useState([]);
  const [displayPassword, setDisplayPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);

  //Changes table's page
  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  //Changes amount of rows per page on table
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  //*******************************FUNCTIONS TO MANAGE OPENING/CLOSING POPUPS******************************* */
  //Opens to admin popup
  function openToAdmin(ID) {
    setEditID(ID);
    setToAdminPopup(true);
  }

  //Opens to user popup
  function openToUser(ID) {
    setEditID(ID);
    setToUserPopup(true);
  }

  //Opens password reset popup
  function openPassword(ID) {
    setEditID(ID);
    setPasswordPopup(true);
    getPassword(ID);
  }

  //Opens delete popup
  function openDelete(ID) {
    setEditID(ID);
    setDeletePopup(true);
  }

  //Opens error popup
  function openErrorPopup() {
    setErrorPopup(true);
  }

  //Opens new user popup
  function openNewUser() {
    setNewUserPopup(true);
  }

  //Closes popups
  function closePopup() {
    setDeletePopup(false);
    setPasswordPopup(false);
    setErrorPopup(false);
    setNewUserPopup(false);
    setToAdminPopup(false);
    setToUserPopup(false);
  }

  //****************************************FUNCTIONS TO MODIFY USER DATA**************************************** */
  //Sends reset password link
  const resetPassword = async (userID) => {
    let changedPassword = document.getElementById("changed-password").value;
    let changedPasswordCheck = document.getElementById(
      "changed-password-check"
    ).value;
    // If both fields are not filled out
    if (changedPassword === "" || changedPasswordCheck === "") {
      document.getElementById("change-pass-fields").style.display = "block";
    }
    // If passwords do not match
    else if (changedPassword !== changedPasswordCheck) {
      document.getElementById("change-pass-no-match").style.display = "block";
    }
    // Change the password
    else
      try {
        // Send request to the backend to update password
        const response = await axios.put(
          "/api/password/" + userID,
          JSON.stringify({
            Id: userID,
            User_Name: name,
            User_Email: email,
            User_Password: changedPassword,
            User_IsAdmin: 1,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        closePopup();
      } catch (error) {
        console.log(error);
      }
  };

  //Deletes user
  const deleteUser = async (userID) => {
    try {
      const response = await axios.post(
        "/api/users/" + userID,
        JSON.stringify({
          Id: userID,
          User_Name: name,
          User_Email: email,
          User_Password: password,
          User_IsAdmin: 1,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      closePopup();
      populateTable();
    } catch (error) {
      console.log(error);
    }
  };

  // Changes user account status to administrator
  const changeToAdmin = async (userID) => {
    try {
      const response = await axios.put(
        "/api/users/" + userID,
        JSON.stringify({
          Id: userID,
          User_Name: name,
          User_Email: email,
          User_Password: password,
          User_IsAdmin: 1,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      closePopup();
      populateTable();
    } catch (error) {
      console.log(error);
    }
  };

  //Changes account status to normal user
  const changeToUser = async (userID) => {
    try {
      const response = await axios.put(
        "/api/users/" + userID,
        JSON.stringify({
          Id: userID,
          User_Name: name,
          User_Email: email,
          User_Password: password,
          User_IsAdmin: 0,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      closePopup();
      populateTable();
    } catch (error) {
      console.log(error);
    }
  };

  //****************************************FUNCTIONS TO RETRIEVE AND DISPLAY USER DATA**************************************** */
  // Get all users for user table
  const populateTable = async () => {
    try {
      const response = await axios.get("/api/users");
      setUserData(response.data);
      // clear user states to allow for proper register user functionality
      setUserId();
      setName("");
      setEmail("");
      setIsAdmin(0);
    } catch (error) {
      console.log(error);
    }
  };

  // Populate table when page initially loads
  useEffect(() => {
    populateTable();
  }, []);

  // Function to retrieve a user's current password (displayed in change password popup)
  const getPassword = async (userID) => {
    setShowPassword(false);
    userID = parseInt(userID);
    try {
      let response = await axios.post(
        "/api/password/" + userID,
        JSON.stringify({
          Id: userID,
          User_Name: name,
          User_Email: email,
          User_Password: password,
          User_IsAdmin: 0,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      let currentPassword = response.data[0].User_Password;
      setDisplayPassword(currentPassword);
      return displayPassword;
    } catch (error) {
      console.log(error);
    }
  };

  // Function to change visibility of current password in the change password popup
  const passVisibility = () => {
    if (showPassword === true) {
      setShowPassword(false);
    } else if (showPassword === false) {
      setShowPassword(true);
    }
  };

  //****************************************FUNCTIONS REQUIRED TO REGISTER A NEW USER*************************************** */

  // Convert string true/false to boolean value to allow proper format for database User_IsAdmin attribute
  const convertToBoolean = (value) => {
    if (value === true) return 1;
    if (value === false) return 0;
    return value;
  };

  // Submit Register New User Form
  const newUserSubmit = async (e) => {
    e.preventDefault();

    let userId = document.getElementById("new-id").value;
    let password = document.getElementById("new-password").value;
    let passwordCheck = document.getElementById("new-password-check").value;
    let email = document.getElementById("new-email").value;
    let name = document.getElementById("new-name").value;

    //If all fields are not filled out
    if (
      userId === "" ||
      password === "" ||
      passwordCheck === "" ||
      email === "" ||
      name === ""
    ) {
      document.getElementById("new-user-fields").style.display = "block";
    }
    //If passwords do not match
    else if (password !== passwordCheck) {
      document.getElementById("new-user-fields").style.display = "none";
      document.getElementById("new-pass-no-match").style.display = "block";
    }
    // Add the new user
    else {
      try {
        userId = parseInt(userId);
        const response = await axios.post(
          "/api/users",
          JSON.stringify({
            Id: userId,
            User_Name: name,
            User_Email: email,
            User_Password: password,
            User_IsAdmin: isAdmin,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        if (error.response?.status === 409) {
          setErrMsg("User already exists");
        } else {
          setErrMsg("Registration failed");
        }
      }
      closePopup();
      populateTable();
    }
  };

  // Array to hold list of users retrieved from DB
  const rows = [...userData];

  const adminIcon = (
    <Tooltip title="Administrator">
      <SupervisorAccountIcon />
    </Tooltip>
  );

  return (
    <div>
      <Header />
      <div className="mainContent">
        <div className="table">
          <TableContainer component={Paper}>
            <Table stickyHeader sx={{ minWidth: 100 }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "10px" }}>{adminIcon}</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>
                    Actions
                    <Button
                      id="add-user"
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<AddIcon />}
                      onClick={openNewUser}
                    >
                      New User
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => (
                    <TableRow key={row.Id} className="row">
                      <TableCell style={{ width: "10px" }}>
                        {row.User_IsAdmin === true ? adminIcon : ""}
                      </TableCell>
                      <TableCell>{row.Id}</TableCell>
                      <TableCell>{row.User_Name}</TableCell>
                      <TableCell>{row.User_Email}</TableCell>
                      <TableCell>
                        <Tooltip title="Reset password">
                          <IconButton onClick={() => openPassword(row.Id)}>
                            <PasswordIcon style={{ color: "#18563e" }} />
                          </IconButton>
                        </Tooltip>
                        {/* If account is normal user */}
                        {!row.User_IsAdmin && (
                          <Tooltip title="Change to administrator">
                            <IconButton
                              onClick={() => {
                                openToAdmin(row.Id);
                              }}
                            >
                              <SupervisorAccountIcon
                                style={{ color: "#18563e" }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                        {/* If account is admin */}
                        {row.User_IsAdmin && (
                          <Tooltip title="Change to user">
                            <IconButton onClick={() => openToUser(row.Id)}>
                              <PersonIcon style={{ color: "#18563e" }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete user">
                          <IconButton onClick={() => openDelete(row.Id)}>
                            <DeleteForeverIcon style={{ color: "red" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
      <Fab
        id="add-user-mobile"
        size="medium"
        color="primary"
        aria-label="add"
        onClick={openNewUser}
      >
        <div className="center">
          <AddIcon style={{ marginTop: "-50px" }} />
        </div>
      </Fab>

      {/* Delete popup */}
      <Dialog open={deletePopup} onClose={closePopup}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this user?
            <br />
            This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup}>Cancel</Button>
          <Button style={{ color: "red" }} onClick={() => deleteUser(editID)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password popup */}
      <Dialog fullWidth maxWidth="xs" open={passwordPopup} onClose={closePopup}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Grid container alignItems="center">
            <Grid item xs={5}>
              <Typography variant="body1" id="current-password-label">
                Current Password:
              </Typography>
            </Grid>

            <Grid item xs={6}>
              {showPassword ? (
                <Typography id="visible-password">{displayPassword}</Typography>
              ) : (
                <Typography id="hidden-password">{displayPassword}</Typography>
              )}
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={passVisibility}>
                {showPassword ? (
                  <Tooltip title="Hide password">
                    <VisibilityOffIcon />
                  </Tooltip>
                ) : (
                  <Tooltip title="Show password">
                    <VisibilityIcon />
                  </Tooltip>
                )}
              </IconButton>
            </Grid>
          </Grid>
          <br />
          <TextField
            className="inputField"
            id="changed-password"
            label="New Password"
            type="password"
            variant="outlined"
            style={{ marginBottom: "15px" }}
            required
          />
          <br />
          <TextField
            className="inputField"
            id="changed-password-check"
            label="Re-Enter New Password"
            type="password"
            variant="outlined"
            required
          />
          <Typography
            id="change-pass-fields"
            style={{ display: "none", color: "red" }}
            variant="body1"
          >
            Please fill out all fields.
          </Typography>
          <Typography
            id="change-pass-no-match"
            style={{ display: "none", color: "red" }}
            variant="body1"
          >
            Passwords do not match.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup}>Cancel</Button>
          <Button onClick={() => resetPassword(editID)}>Reset</Button>
        </DialogActions>
      </Dialog>

      {/* New user popup */}
      <Dialog fullWidth maxWidth="xs" open={newUserPopup} onClose={closePopup}>
        <DialogTitle>New User</DialogTitle>
        <DialogContent>
          <TextField
            className="inputField"
            id="new-id"
            label="User ID"
            type="text"
            variant="outlined"
            style={{ marginBottom: "15px" }}
            required
          />
          <br />
          <TextField
            className="inputField"
            id="new-name"
            label="Name"
            type="text"
            variant="outlined"
            style={{ marginBottom: "15px" }}
            required
          />
          <br />
          <TextField
            className="inputField"
            id="new-email"
            label="Email"
            type="email"
            variant="outlined"
            style={{ marginBottom: "15px" }}
            required
          />
          <br />
          <TextField
            className="inputField"
            id="new-password"
            label="Password"
            type="password"
            variant="outlined"
            style={{ marginBottom: "15px" }}
            required
          />
          <br />
          <TextField
            className="inputField"
            id="new-password-check"
            label="Re-Enter Password"
            type="password"
            variant="outlined"
            required
          />
          <br />
          <FormControlLabel
            id="new-set-admin"
            control={
              <Checkbox
                color="primary"
                onChange={(e) => setIsAdmin(convertToBoolean(e.target.checked))}
              />
            }
            label="Administrator"
          />
          <br />
          <Typography
            id="new-pass-no-match"
            style={{ display: "none", color: "red" }}
            variant="body1"
          >
            Passwords do not match.
          </Typography>
          <Typography
            id="new-user-fields"
            style={{ display: "none", color: "red" }}
            variant="body1"
          >
            Please fill out all fields.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup}>Cancel</Button>
          <Button onClick={newUserSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Error popup */}
      <Dialog open={errorPopup} onClose={closePopup}>
        <DialogTitle>Error :(</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Sorry something happened, please try again.
          </Typography>
        </DialogContent>
        <Button onClick={closePopup}>Close</Button>
      </Dialog>

      {/* To admin popup */}
      <Dialog open={toAdminPopup} onClose={closePopup}>
        <DialogTitle>Administrator</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to make this user an administrator?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup}>Cancel</Button>
          <Button onClick={() => changeToAdmin(editID)}>Continue</Button>
        </DialogActions>
      </Dialog>

      {/* To user popup */}
      <Dialog open={toUserPopup} onClose={closePopup}>
        <DialogTitle>User</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to make this administrator a user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup}>Cancel</Button>
          <Button onClick={() => changeToUser(editID)}>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Admin;
