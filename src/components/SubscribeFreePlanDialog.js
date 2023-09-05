import {
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Dialog,
  Button,
} from "@mui/material";

const SubscribeFreePlanDialog = (props) => (
  <Dialog
    open={props.open}
    onClose={props.handleClose}
    aria-labelledby="responsive-dialog-title"
  >
    <DialogTitle id="responsive-dialog-title">
      {"Subscribing free plan"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        Free plan is default plan. When you cancel your current plan, you will automatically by default subscribed to Free plan. You don't need to subscribe Free plan manually.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      
      <Button color="error" onClick={props.handleClose} autoFocus>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

export default SubscribeFreePlanDialog;
