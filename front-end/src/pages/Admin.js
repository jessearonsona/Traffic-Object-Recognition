// TODO: In new user popup, change id to int, change isAdmin to bit (0 or 1),
// validate passwords for new users (upper and lowercase letters, number, 6 chars, etc)
// success message for adding new user
// increase width of the new user popup
// move the add new user button?

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
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Admin = () => {
  const errRef = useRef();

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
  const [passwordCheck, setPasswordCheck] = useState();
  const [isAdmin, setIsAdmin] = useState();

  const [errMsg, setErrMsg] = useState();
  const [success, setSuccess] = useState();
  // Set state to validate email address and password when registering new user
  const [validEmail, setValidEmail] = useState();
  const [validPassword, setValidPassword] = useState();
  const [validMatch, setValidMatch] = useState();

  // Set state for data to populate user table
  const [userData, setUserData] = useState([]);

  //SHOULDN'T NEED THIS AFTER PULLING DATA FROM DB
  function createData(id, userId, isAdmin, name, email) {
    return { id: id, userId: userId, admin: isAdmin, name: name, email: email };
  }

  //Changes table's page
  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  //Changes amount of rows per page on table
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

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

  //Sends reset password link
  function resetPassword() {
    closePopup();
  }

  //Deletes user
  function deleteUser() {
    closePopup();
  }

  //Changes account status to administrator
  function changeToAdmin() {
    closePopup();
  }

  //Changes account status to normal user
  function changeToUser() {
    closePopup();
  }

  // // Validate email and password when registering new user
  // const EMAIL_REGEX = "[a-z0-9]+@ndsu.edu";
  // const PASSWORD_REGEX = "/^(?-.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{4,24}$/";

  // useEffect(() => {
  //   const result = EMAIL_REGEX.test(email);
  //   console.log(result);
  //   console.user(email);
  //   setValidEmail(result);
  // }, [email]);

  // useEffect(() => {
  //   const result = PASSWORD_REGEX.test(password);
  //   console.log(result);
  //   console.user(password);
  //   setValidPassword(result);
  //   // const match = password === passwordCheck
  //   // setValidMatch(match);
  // }, [password]);

  // useEffect(() => {
  //   setErrMsg("");
  // }, [email, password, passwordCheck]);

  const populateTable = async () => {
    try {
      const response = await axios.get("/api/users");
      setUserData(response.data);
      // clear user fields to allow for proper register user functionality
      setUserId();
      setName("");
      setEmail("");
      setIsAdmin(0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    populateTable();
  }, []);

  // Convert string true/false to boolean value
  const convertToBoolean = (value) => {
    if (value === true) return 1;
    if (value === false) return 0;
    return value;
  };

  //Register a new user
  const newUserSubmit = async (e) => {
    let userId = document.getElementById("new-id").value;
    let password = document.getElementById("new-password").value;
    let passwordCheck = document.getElementById("new-password-check").value;
    let email = document.getElementById("new-email").value;
    let name = document.getElementById("new-name").value;

    e.preventDefault();

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
            // withCredentials: true,
          }
        );
        console.log(response.data);
        // console.log(response.accessToken);
        console.log(JSON.stringify(response));
        setSuccess(true);
        // could also set user states back to empty strings here to clear input fields if you want
      } catch (error) {
        if (error.response?.status === 409) {
          setErrMsg("User already exists");
        } else {
          setErrMsg("Registration failed");
        }
      }
      // console.log(
      //   "NEW USER: User ID: " +
      //     userId +
      //     ", Name: " +
      //     name +
      //     ", Email: " +
      //     email +
      //     ", Password: " +
      //     passwordCheck +
      //     ", Administrator:  " +
      //     isAdmin
      // );
      closePopup();
      populateTable();
    }
  };

  const adminIcon = (
    <Tooltip title="Administrator">
      <SupervisorAccountIcon />
    </Tooltip>
  );

  // const rows = [
  //   createData(1, 1111, true, "Annika Hansen", "email@email.com"),
  //   createData(2, 2222, false, "Agnes Jurati", "email@email.com"),
  // ];
  const rows = [...userData];

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
                    <TableRow key={i} className="row">
                      <TableCell style={{ width: "10px" }}>
                        {row.User_IsAdmin === true ? adminIcon : ""}
                      </TableCell>
                      <TableCell>{row.Id}</TableCell>
                      <TableCell>{row.User_Name}</TableCell>
                      <TableCell>{row.User_Email}</TableCell>
                      <TableCell>
                        <Tooltip title="Reset password">
                          <IconButton onClick={() => openPassword(row.id)}>
                            <PasswordIcon style={{ color: "#18563e" }} />
                          </IconButton>
                        </Tooltip>
                        {/* If account is normal user */}
                        {!row.User_IsAdmin && (
                          <Tooltip title="Change to administrator">
                            <IconButton onClick={() => openToAdmin(row.id)}>
                              <SupervisorAccountIcon
                                style={{ color: "#18563e" }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                        {/* If account is admin */}
                        {row.User_IsAdmin && (
                          <Tooltip title="Change to user">
                            <IconButton onClick={() => openToUser(row.id)}>
                              <PersonIcon style={{ color: "#18563e" }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete user">
                          <IconButton onClick={() => openDelete(row.id)}>
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
          <Button style={{ color: "red" }} onClick={deleteUser}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Password popup */}
      <Dialog open={passwordPopup} onClose={closePopup}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to send the reset password link to this user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup}>Cancel</Button>
          <Button onClick={resetPassword}>Send</Button>
        </DialogActions>
      </Dialog>
      {/* New user popup */}
      <Dialog open={newUserPopup} onClose={closePopup}>
        <DialogTitle>New User</DialogTitle>
        <DialogContent>
          <TextField
            id="new-id"
            label="User ID"
            type="text"
            variant="outlined"
            style={{ marginBottom: "15px" }}
            // onChange={(e) => setUserId(e.target.value)}
            required
          />
          <br />
          <TextField
            id="new-name"
            label="Name"
            type="text"
            variant="outlined"
            style={{ marginBottom: "15px" }}
            // onChange={(e) => setName(e.target.value)}
            required
          />
          <br />
          <TextField
            id="new-email"
            label="Email"
            type="email"
            variant="outlined"
            style={{ marginBottom: "15px" }}
            // onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <TextField
            id="new-password"
            label="Password"
            type="password"
            variant="outlined"
            style={{ marginBottom: "15px" }}
            // onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <TextField
            id="new-password-check"
            label="Re-Enter Password"
            type="password"
            variant="outlined"
            // onChange={(e) => setPasswordCheck(e.target.value)}
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
          {/* <p ref={errRef} className={errMsg ? "errmsg" : "none"}>
            {errMsg}
          </p> */}
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
          <Button onClick={changeToAdmin}>Continue</Button>
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
          <Button onClick={changeToUser}>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Admin;
