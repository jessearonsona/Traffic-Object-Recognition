//TODO: Wrap login side in a form, import password field to hide typing
import "../styling/Login.css";
import Header from "../components/Header";
import Image from "../assets/caleb-george-URmkfvtK3Qw-unsplash.jpg";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { Person, VpnKey } from "@mui/icons-material";

const Login = () => {
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
                  label="username"
                  InputProps={{
                    startAdornment: <Person />,
                  }}
                ></TextField>
              </Grid>

              <Grid item>
                <TextField
                  id="textfield"
                  variant="outlined"
                  label="password"
                  InputProps={{
                    startAdornment: <VpnKey />,
                  }}
                ></TextField>
              </Grid>

              <Grid item>
                <Button id="forgotPWButton" disableRipple>
                  Forgot Password?
                </Button>
              </Grid>

              <Grid item>
                <Button id="loginButton" variant="contained" color="secondary">
                  Login
                </Button>
              </Grid>
            </Grid>
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
