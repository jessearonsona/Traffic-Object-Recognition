import Header from "../components/Header";
import { Typography } from "@mui/material";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { borders } from '@material-ui/system';


const Account = () => {
    return (
    <div className="container">
      <Header />
      <main id="mainContent">
        <Typography id="title"variant="h5" align="center">My Account <p></p></Typography>

        <Box display="inline-flex" justifyContent="center" width="100%" bgcolor="grey.300" p={1} my={0.5} border="1px solid">
        <Typography id="info" variant="h6" component="div" >
                <p>First Name: Peter</p>
                <p>Last Name: Parker</p>
                <p>Role: User</p>
                <p>Email: Peter_Parker@gmail.com</p>
              </Typography>
              </Box>
      </main>
    </div>
    );
};


export default Account;