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

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { Skeleton } from "@mui/material";
import { useForm } from "react-hook-form";

import * as authenticationServive from "../services/authentication";
import * as logger from "../utils/logger";

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

export default function ChangePasswordDialog(props) {
  const { t } = useTranslation(["common", "ChangePasswordDialog"]);
  //Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Alert variables
  // const [alertOpen, setAlertOpen] = React.useState(false);
  // const openAlert = () => {
  //   setAlertOpen(true);
  //   setTimeout(() => setAlertOpen(false), 3000);
  // };
  // const [alertSeverity, setAlertSeverity] = React.useState("success");
  // const [alertMessage, setAlertMessage] = React.useState("");

  // Processing variables
  const [loading, setLoading] = React.useState(false);
  const [passwordMatch, setPasswordMatch] = React.useState(true);

  const handleSubmitForm = async (formData) => {
    logger.log("Update password form submit");
    logger.log(formData);
    logger.groupEnd();

    // Validating if password and comfirmPassword are equal
    if (formData.newPassword !== formData.confirmNewPassword)
      return setPasswordMatch(false);
    setPasswordMatch(true);
    setLoading(true);

    const formValues = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword,
    };
    try {
      const response = await authenticationServive.updatePassword(
        formValues.currentPassword,
        formValues.newPassword,
        formValues.confirmNewPassword
      );
      logger.log("response:)");
      logger.log(response);
      logger.log(response.status);
      if (response?.data?.success) {
        // Close the dialog
        cancelMethod();

        props.setAlertSeverity("success");
        props.setAlertMessage(t("ChangePasswordDialog:alertSuccess"));
        setLoading(false);
        props.openAlert();
        // RESET FORM
        reset();
      } else {
        // Close the dialog
        cancelMethod();

        props.setAlertSeverity("error");
        props.setAlertMessage(
          response?.response?.data?.errorMessage
            ? response?.response?.data?.errorMessage
            : t("ChangePasswordDialog:alertFail")
        );
        setLoading(false);
        props.openAlert();
      }
    } catch (error) {
      // Close the dialog
      cancelMethod();

      props.setAlertSeverity("error");
      props.setAlertMessage(error.message);
      setLoading(false);
      props.openAlert();
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
          {t("ChangePasswordDialog:title")}
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
                    {...register("currentPassword", {
                      required: true,
                    })}
                    type="password"
                    label={t("ChangePasswordDialog:currentPassword")}
                    fullWidth
                    error={Boolean(errors.currentPassword)}
                    helperText={
                      errors.currentPassword
                        ? t("ChangePasswordDialog:currentPasswordError")
                        : ""
                    }
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
                    {...register("newPassword", {
                      required: true,
                      minLength: 6,
                    })}
                    type="password"
                    label={t("ChangePasswordDialog:newPassword")}
                    fullWidth
                    error={Boolean(errors.newPassword)}
                    helperText={
                      errors.password
                        ? t("ChangePasswordDialog:newPasswordError")
                        : t("ChangePasswordDialog:newPasswordMinCharacters")
                    }
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
                    {...register("confirmNewPassword", {
                      required: true,
                      minLength: 6,
                    })}
                    type="password"
                    label={t("ChangePasswordDialog:confirmNewPassword")}
                    fullWidth
                    error={!passwordMatch || Boolean(errors.confirmNewPassword)}
                    helperText={
                      !passwordMatch
                        ? t("ChangePasswordDialog:confirmNewPasswordError1")
                        : errors.confirmPassword
                        ? t("ChangePasswordDialog:confirmNewPasswordError2")
                        : t("ChangePasswordDialog:confirmNewPasswordError3")
                    }
                  />
                )}
              </Grid>
            </Grid>
            <DialogActions>
              <Button disabled={loading} onClick={cancelMethod} color="error">
                {t("common:cancel")}
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {t("ChangePasswordDialog:updatePassword")}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
