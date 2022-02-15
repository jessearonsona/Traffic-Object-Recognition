import "../styling/Login.css";
import Header from "../components/Header";
import Image from "./caleb-george-URmkfvtK3Qw-unsplash.jpg";
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { Person, VpnKey } from "@mui/icons-material";

const Login = () => {
  return (
    <div className="container">
      <Header />
      <main id="mainContent">
        <Grid container id="outerGrid">
          <Grid item xs={12} sm={6} justify="center">
            <Paper id="imagePaper" align="center">
              <img src={Image} id="image" />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} direction="column" align="center">
            <Grid
              container
              id="formGrid"
              direction="column"
              display="flex"
              justify="center"
            >
              <Typography id="title" variant="h4">
                WELCOME TO UGPTI
              </Typography>

              <Typography id="subtext" variant="h6">
                Login to continue
              </Typography>

              <TextField
                id="textfield"
                variant="outlined"
                label="username"
                InputProps={{
                  startAdornment: <Person />,
                }}
              ></TextField>
              <Typography id="spacer" variant="subtitle2">
                spacer
              </Typography>

              <TextField
                id="textfield"
                variant="outlined"
                label="password"
                InputProps={{
                  startAdornment: <VpnKey />,
                }}
              ></TextField>

              <Typography id="subtext" variant="h6">
                Forgot Password?
              </Typography>
              <Button id="loginButton" variant="contained" color="secondary">
                Login
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

export default Login;
