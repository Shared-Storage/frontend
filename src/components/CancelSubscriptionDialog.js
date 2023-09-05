import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Button,
  DialogContentText,
} from "@mui/material";
import * as logger from "./../utils/logger";
import { useSelector, useDispatch } from "react-redux";

const CancelSubscriptionDialog = (props) => {
  const handleClose = () => {
    props.handleClose();
  };
  const userSubscription = useSelector((state) => {
    return state.subscription;
  });
  const cancelClicked = () => {
    props.cancel();
    props.handleClose();
  };
  return (
    <>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Are you sure you want to cancel{" "}
          <b>{userSubscription.subscription} subscription plan</b>?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will be downgraded from <b>{userSubscription.subscription}</b>{" "}
            to default <b>Free</b> plan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="info" autoFocus onClick={handleClose}>
            Continue with subscription
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={cancelClicked}
            autoFocus
          >
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CancelSubscriptionDialog;
