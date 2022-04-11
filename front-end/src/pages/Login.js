//TODO: Wrap login side in a form, import password field to hide typing
import "../styling/Login.css";
import Header from "../components/Header";
import Image from "../assets/caleb-george-URmkfvtK3Qw-unsplash.jpg";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { Person, VpnKey } from "@mui/icons-material";
import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../AuthProvider";
import axios from "axios";

const Login = () => {
  // set auth state in global context after successful login
  const { setAuth } = useContext(AuthContext);

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errMsg, setErrMsg] = useState();

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    let email = document.getElementById("new-email").value;
    let password = document.getElementById("new-password").value;

    e.preventDefault();
    // call API for login, uncomment after setting up backend
    try {
      // call the API for login
      const response = await axios.post(
        "/api/login",
        JSON.stringify({ User_Email: email, User_Password: password }),
        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );
      console.log(JSON.stringify(response?.data));
      // localStorage.setItem("userInfo", JSON.stringify(response?.data));
      // const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      // setAuth({email, password, roles, accessToken});
      setAuth({ email, password });

      //clear input fields if login is successful
      setEmail("");
      setPassword("");
      // return <Navigate replace to="/tracking" />;
      // setRedirect(true);
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error.response.data.message);
      }
    }
    console.log(email, password);
    // if (redirect) {
    //   return <Navigate to="/tracking" />;
    // }
  };

  return (
    <div className="container">
      <Header />
      <main id="mainContent">
        <Grid container id="outerGrid" justifyContent="center">
          <Grid item xs={0} sm={1} med={2}>
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
                      Invalid email or password!
                    </Typography>
                  </Grid>
                )}

                <Grid item>
                  <Button id="forgotPWButton" disableRipple>
                    Reset Password
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    id="loginButton"
                    variant="contained"
                    color="secondary"
                    href="/tracking"
                    onClick={handleSubmit}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item xs={0} sm={1} med={2}>
            {/* spacer */}
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

export default Login;
