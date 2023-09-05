import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "../components/Copyright";
import * as authenticationServive from "../services/authentication";
import Alert from "./../components/Alert";
import { Skeleton } from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as logger from "../utils/logger";
import { useTranslation } from "react-i18next";

// TODO remove, this demo shouldn't need to reset the theme.
export default function VerifyForgotPassword() {
  const { t } = useTranslation(["common", "VerifyForgotPassword"]);
  const params = useParams();
  const token = params.token;
  const [passwordMatch, setPasswordMatch] = React.useState(true);
  //Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Alert variables
  const [alertOpen, setAlertOpen] = React.useState(false);
  const openAlert = () => {
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);
  };
  const [alertSeverity, setAlertSeverity] = React.useState(t("VerifyForgotPassword:alertSuccess"));
  const [alertMessage, setAlertMessage] = React.useState("");

  // Processing variables
  const [loading, setLoading] = React.useState(false);

  const handleSubmitForm = async (formData) => {
    logger.group("Reset Forgot password form submit");
    logger.log(formData);
    logger.groupEnd();

    // Validate if newPassword and confirmNewPassword are equal
    logger.log(formData.newPassword !== formData.confirmNewPassword);
    if (formData.newPassword !== formData.confirmNewPassword)
      return setPasswordMatch(false);
    setPasswordMatch(true);
    setLoading(true);
    try {
      const response = await authenticationServive.verifyForgotPassword(
        formData.newPassword,
        token
      );

      if (response.data.success) {
        setAlertSeverity("success");
        setAlertMessage(t("VerifyForgotPassword:alertSuccess"));
        setLoading(false);
        openAlert();
        // RESET FORM
        reset();
      } else {
        setAlertSeverity("error");
        setAlertMessage(t("VerifyForgotPassword:alertFail"));
        setLoading(false);
        openAlert();
      }
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(error.message);
      setLoading(false);
      openAlert();
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t("VerifyForgotPassword:heading")}
        </Typography>

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
                  {...register("newPassword", {
                    required: true,
                    minLength: 6,
                  })}
                  type="password"
                  label={t("VerifyForgotPassword:newPasswordLabel")}
                  fullWidth
                  error={Boolean(errors.newPassword)}
                  helperText={
                    errors.newPassword
                      ? t("VerifyForgotPassword:invalidNewPassword1")
                      : t("VerifyForgotPassword:invalidNewPassword2")
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
                  label={t("VerifyForgotPassword:newPasswordConfirmLabel")}
                  fullWidth
                  error={!passwordMatch || Boolean(errors.confirmNewPassword)}
                  helperText={
                    !passwordMatch
                      ? t("VerifyForgotPassword:invalidNewPasswordConfirm1")
                      : errors.confirmNewPassword
                      ? t("VerifyForgotPassword:invalidNewPasswordConfirm2")
                      : t("VerifyForgotPassword:invalidNewPasswordConfirm3")
                  }
                />
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {t("VerifyForgotPassword:submitButtonText")}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
              {t("VerifyForgotPassword:signInLinkText")}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
      {/* Error, info, warning and success */}
      <Alert severity={alertSeverity} open={alertOpen} message={alertMessage} />
    </Container>
  );
}
