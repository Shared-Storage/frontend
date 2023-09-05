import {
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Dialog,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";

const UpdateSubscriptionPlanDialog = (props) => {
  const userSubscription = useSelector((state) => {
    return state.subscription;
  });
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Are you sure you want to change subscription plan?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You are going to be switched from{" "}
          <b>{userSubscription.subscription}</b> plan to{" "}
          <b>{props.membershipPlan}</b> plan.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={props.handleClose} autoFocus>
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={props.updateSubscription.bind(
            this,
            userSubscription.subscriptionId,
            userSubscription.subscriptionItemId,
            props.membershipPlan
          )}
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateSubscriptionPlanDialog;
