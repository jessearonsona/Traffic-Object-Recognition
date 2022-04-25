import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const ResetPW = (props) => {
  return (
    <div>
      <Dialog
        open={props.isDialogOpened}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Request Password?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please send an email to grit@ugpti.org to request a password reset.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={props.handleCloseDialog}
            color="primary"
            autoFocus
          >
            Got It
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ResetPW;
