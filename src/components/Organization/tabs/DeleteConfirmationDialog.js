import * as React from "react";

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogContentText,
  Button,
} from "@mui/material";

export default function DeleteConfirmationDialog(props) {
  return (
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        width="50vw"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete <b>{props.name}</b> ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={props.handleConfirmDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
  );
}
