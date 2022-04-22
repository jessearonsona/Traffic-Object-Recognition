import "../styling/Login.css";
import Header from "../components/Header";
import Image from "../assets/caleb-george-URmkfvtK3Qw-unsplash.jpg";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { Person, VpnKey } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import ResetPW from "../components/popups/ResetPW";

const Login = () => {
  // set auth state in global context after successful login
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  // set states
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errMsg, setErrMsg] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // remove error message when user begins to edit user or password fields
  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  // Function to open and close Reset Password popup
  const handleResetPW = () => {
    setIsOpen(!isOpen);
  };

  // Function to check login credentials to authorize user
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrMsg("Please complete both fields");
    } else {
      // call API for login
      try {
        const response = await axios.post(
          "/api/login",
          JSON.stringify({ User_Email: email, User_Password: password }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(JSON.stringify(response?.data));
        const accessToken = response?.data?.accessToken;
        let validUser = response?.data;
        if (validUser) {
          // clear email and password textfields upon successful login
          setAuth({ email, password, accessToken });
          setEmail("");
          setPassword("");
          // store user's isAdmin property and access token in local storage
          localStorage.setItem("admin", JSON.stringify(response?.data.isAdmin));
          localStorage.setItem(
            "token",
            JSON.stringify(response?.data.accessToken)
          );
          // redirect authorized user to tracking page
          navigate("/tracking");
        } else {
          setErrMsg("Invalid email or password!");
        }
      } catch (error) {
        console.log(error.response.data);
        setErrMsg(error.response.data);
      }
    }
  };

  return (
    <div className="container">
      <Header admin={isAdmin} />
      <main id="mainContent">
        <Grid container id="outerGrid" justifyContent="center">
          <Grid item sm={1} med={2}>
            {/* spacer */}
          </Grid>
          <Grid item xs={12} sm={5} med={4} id="imageContainer" align="center">
            <img src={Image} alt="" id="image" />
          </Grid>

          <Grid item xs={12} sm={5} med={4} id="formContainer" align="center">
            <form>
              <Grid
                container
                id="formGrid"
                direction="column"
                display="flex"
                justifyContent="center"
                spacing={2}
              >
                <Grid item>
                  <Typography id="title" variant="h4">
                    WELCOME TO UGPTI
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography id="subtext" variant="h6">
                    Login to continue
                  </Typography>
                </Grid>

                <Grid item>
                  <TextField
                    id="textfield"
                    variant="outlined"
                    label="email"
                    InputProps={{
                      startAdornment: <Person />,
                    }}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  ></TextField>
                </Grid>

                <Grid item>
                  <TextField
                    id="passwordField"
                    variant="outlined"
                    label="password"
                    InputProps={{
                      startAdornment: <VpnKey />,
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  ></TextField>
                </Grid>

                {errMsg && (
                  <Grid item>
                    <Typography id="errorMessage" style={{ color: "red" }}>
                      {errMsg}
                    </Typography>
                  </Grid>
                )}

                <Grid item>
                  <Button
                    id="forgotPWButton"
                    disableRipple
                    onClick={handleResetPW}
                  >
                    Request Password
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    id="loginButton"
                    variant="contained"
                    color="secondary"
                    // href="/tracking"
                    onClick={handleSubmit}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item sm={1} med={2}>
            {/* spacer */}
          </Grid>
        </Grid>
      </main>
      {/* Password popup */}
      <ResetPW
        isDialogOpened={isOpen}
        handleCloseDialog={() => setIsOpen(false)}
      />
    </div>
  );
};

export default Login;
