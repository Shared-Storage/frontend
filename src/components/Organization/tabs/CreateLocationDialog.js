import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import {
  DialogActions,
  TextField,
  IconButton,
  DialogContent,
  DialogTitle,
  Dialog,
  Button,
} from "@mui/material";

import { useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { Skeleton } from "@mui/material";
import { useForm } from "react-hook-form";

// import * as organizationService from "../../services/organization";
import * as logger from "../../../utils/logger";
import { createLocation } from "../../../services/storage";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CreateLocationDialog(props) {
  const { t } = useTranslation(["common", "ChangePasswordDialog"]);
  const params = useParams();
  //Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      name: null,
      img: null,
    },
  });

  // Processing variables
  const [loading, setLoading] = React.useState(false);

  const handleSubmitForm = async (formData) => {
    setLoading(true);
    try {
      const organizationId = params?.organizationId;

      if (organizationId) {
        // Create location
        const objectToBeSent = {
          ...formData,
          organizationId: organizationId,
        };
        await createLocation(objectToBeSent);
      } else {
        // Display error
        logger.error("Couldn't retrieve organization id");
      }
      props.refreshLocations()
      props.setAlertSeverity("success");
      props.setAlertMessage("Successfully created");
      setLoading(false);
      props.setAlertOpen();
      //   // RESET FORM
      reset();
      cancelMethod();
    } catch (error) {
      logger.error(error);
      cancelMethod();

      props.setAlertSeverity("error");
      props.setAlertMessage(error.message);
      setLoading(false);
      props.setAlertOpen();
    }
  };
  const cancelMethod = () => {
    reset();
    props.handleClose();
  };
  return (
    <div>
      <BootstrapDialog
        onClose={cancelMethod}
        aria-labelledby="customized-dialog-title"
        open={props.open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={cancelMethod}
        >
          Create Location
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit((data) => handleSubmitForm(data))}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {loading ? (
                  <Skeleton variant="text" width="100%" height="150%">
                    <TextField />
                  </Skeleton>
                ) : (
                  <TextField
                    {...register("name", {
                      required: true,
                    })}
                    type="text"
                    label={"Name"}
                    fullWidth
                    error={Boolean(errors.name)}
                    helperText={errors.name ? "Name error" : ""}
                    required
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                {loading ? (
                  <Skeleton variant="text" width="100%" height="150%">
                    <TextField />
                  </Skeleton>
                ) : (
                  <TextField
                    {...register("img")}
                    type="text"
                    label={"Image uri"}
                    fullWidth
                    error={Boolean(errors.img)}
                    helperText={errors.img ? "Image error" : ""}
                  />
                )}
              </Grid>
            </Grid>
            <DialogActions>
              <Button disabled={loading} onClick={cancelMethod} color="error">
                {t("common:cancel")}
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                Submit
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
