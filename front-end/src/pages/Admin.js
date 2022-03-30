import React from "react";
import "../styling/Admin.css";
import Header from "../components/Header";
import {
    Button,
    Checkbox, Dialog, DialogActions,
    DialogContent,
    DialogTitle, Fab, FormControlLabel,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, TextField, Tooltip, Typography
} from "@material-ui/core";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PasswordIcon from '@mui/icons-material/Password';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from '@mui/icons-material/Person';

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

    function createData(id, isAdmin, name, email) {
        return {id: id, admin: isAdmin, name: name, email: email};
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
    function openToAdmin(ID)
    {
        setEditID(ID);
        setToAdminPopup(true);
    }

    //Opens to user popup
    function openToUser(ID)
    {
        setEditID(ID);
        setToUserPopup(true);
    }

    //Opens password reset popup
    function openPassword(ID)
    {
        setEditID(ID);
        setPasswordPopup(true);
    }

    //Opens delete popup
    function openDelete(ID)
    {
        setEditID(ID);
        setDeletePopup(true);
    }

    //Opens error popup
    function openErrorPopup()
    {
        setErrorPopup(true);
    }

    //Opens new user popup
    function openNewUser()
    {
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

    //Adds new user
    function newUser()
    {
        let password = document.getElementById("new-password").value;
        let passwordCheck = document.getElementById("new-password-check").value;
        let email = document.getElementById("new-email").value;
        let name = document.getElementById("new-name").value;

        //If all fields are not filled out
        if (password === "" || passwordCheck === "" || email === "" || name === "")
        {
            document.getElementById("new-user-fields").style.display = "block";
        }

        //If passwords do not match
        else if (password !== passwordCheck)
        {
            document.getElementById("new-user-fields").style.display = "none";
            document.getElementById("new-pass-no-match").style.display = "block";
        }

        //Add new user
        else
        {
            closePopup();
        }
    }

    const adminIcon = (
        <Tooltip title="Administrator">
            <SupervisorAccountIcon/>
        </Tooltip>
    );

    const rows = [
        createData(1, true, 'Annika Hansen', "email@email.com"),
        createData(2, false, 'Agnes Jurati', "email@email.com")
    ];

    return (
        <div>
            <Header/>
            <div className="mainContent">
                <div className="table">
                    <TableContainer component={Paper}>
                        <Table stickyHeader sx={{minWidth: 100}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width: "10px"}}>{adminIcon}</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>
                                        Actions
                                        <Button
                                            id="add-user"
                                            variant="contained"
                                            color="primary"
                                            component="span"
                                            startIcon={<AddIcon/>}
                                            onClick={openNewUser}
                                        >
                                            New User
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                    <TableRow key={row.id} className="row">
                                        <TableCell
                                            style={{width: "10px"}}>{row.admin === true ? adminIcon : ""}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Reset password">
                                                <IconButton onClick={() => openPassword(row.id)}>
                                                    <PasswordIcon style={{color: "#18563e"}}/>
                                                </IconButton>
                                            </Tooltip>
                                            {/* If account is normal user */}
                                            {!row.admin &&
                                                <Tooltip title="Change to administrator">
                                                    <IconButton onClick={() => openToAdmin(row.id)}>
                                                        <SupervisorAccountIcon style={{color: "#18563e"}}/>
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                            {/* If account is admin */}
                                            {row.admin &&
                                                <Tooltip title="Change to user">
                                                    <IconButton onClick={() => openToUser(row.id)}>
                                                        <PersonIcon style={{color: "#18563e"}}/>
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                            <Tooltip title="Delete user">
                                                <IconButton onClick={() => openDelete(row.id)}>
                                                    <DeleteForeverIcon style={{color: "red"}}/>
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
                    <AddIcon style={{marginTop: "-50px"}} />
                </div>
            </Fab>
            {/* Delete popup */}
            <Dialog open={deletePopup} onClose={closePopup}>
                <DialogTitle>Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to delete this user?
                        <br/>
                        This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePopup}>Cancel</Button>
                    <Button style={{color: "red"}} onClick={deleteUser}>Delete</Button>
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
                        id="new-name"
                        label="Name"
                        type="text"
                        variant="outlined"
                        style={{marginBottom: "15px"}}
                    />
                    <br/>
                    <TextField
                        id="new-email"
                        label="Email"
                        type="email"
                        variant="outlined"
                        style={{marginBottom: "15px"}}
                    />
                    <br/>
                    <TextField
                        id="new-password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        style={{marginBottom: "15px"}}
                    />
                    <br/>
                    <TextField
                        id="new-password-check"
                        label="Re-Enter Password"
                        type="password"
                        variant="outlined"
                    />
                    <br/>
                    <FormControlLabel id="new-set-admin" control={<Checkbox color="primary"/>} label="Administrator"/>
                    <br/>
                    <Typography
                        id="new-pass-no-match"
                        style={{display: "none", color: "red"}}
                        variant="body1"
                    >
                        Passwords do not match.
                    </Typography>
                    <Typography
                        id="new-user-fields"
                        style={{display: "none", color: "red"}}
                        variant="body1"
                    >
                        Please fill out all fields.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePopup}>Cancel</Button>
                    <Button onClick={newUser}>Submit</Button>
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