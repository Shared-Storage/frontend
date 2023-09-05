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
import { Skeleton } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import Copyright from "../components/Copyright";
import Alert from "./../components/Alert";
import * as authenticationServive from "../services/authentication";
import * as logger from "../utils/logger";

// TODO remove, this demo shouldn't need to reset the theme.
export default function SignUp() {
  const { t } = useTranslation(["common", "SignUp"]);
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
  const [alertSeverity, setAlertSeverity] = React.useState("success");
  const [alertMessage, setAlertMessage] = React.useState("");

  // Processing variables
  const [loading, setLoading] = React.useState(false);
  const [passwordMatch, setPasswordMatch] = React.useState(true);

  const handleSubmitForm = async (formData) => {
    logger.group("Signup form submit");
    logger.log(formData);
    logger.groupEnd();

    // Validating if password and comfirmPassword are equal
    if (formData.password !== formData.confirmPassword)
      return setPasswordMatch(false);
    setPasswordMatch(true);
    setLoading(true);

    const formValues = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };
    try {
      const response = await authenticationServive.signup(
        formValues.firstName,
        formValues.lastName,
        formValues.email,
        formValues.password,
        formValues.confirmPassword
      );

      if (response.data.success) {
        setAlertSeverity("success");
        setAlertMessage(t("SignUp:alertSuccess"));
        setLoading(false);
        openAlert();
        // RESET FORM
        reset();
      } else {
        setAlertSeverity("error");
        setAlertMessage(t("SignUp:alertFail"));
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
          {t("SignUp:heading")}
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit((data) => handleSubmitForm(data))}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {loading ? (
                <Skeleton variant="text" width="100%" height="150%">
                  <TextField />
                </Skeleton>
              ) : (
                <TextField
                  {...register("firstName", { required: true, minLength: 1 })}
                  label={t("SignUp:firstNameLabel")}
                  fullWidth
                  error={Boolean(errors.firstName)}
                  helperText={
                    errors.firstName ? t("SignUp:firstNameError") : ""
                  }
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {loading ? (
                <Skeleton variant="text" width="100%" height="150%">
                  <TextField />
                </Skeleton>
              ) : (
                <TextField
                  {...register("lastName", { required: true, minLength: 1 })}
                  label={t("SignUp:lastNameLabel")}
                  fullWidth
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName ? t("SignUp:lastNameError") : ""}
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
                  {...register("email", {
                    required: true,
                    pattern:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  })}
                  label={t("SignUp:emailLabel")}
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={errors.email ? t("SignUp:emailError") : ""}
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
                  {...register("password", { required: true, minLength: 6 })}
                  type="password"
                  label={t("SignUp:passwordLabel")}
                  fullWidth
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? t("SignUp:invalidPassword")
                      : t("SignUp:invalidPasswordMinCharacters")
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
                  {...register("confirmPassword", {
                    required: true,
                    minLength: 6,
                  })}
                  type="password"
                  label={t("SignUp:confirmPasswordLabel")}
                  fullWidth
                  error={!passwordMatch || Boolean(errors.confirmPassword)}
                  helperText={
                    !passwordMatch
                      ? t("SignUp:confirmPasswordError1")
                      : errors.confirmPassword
                      ? t("SignUp:confirmPasswordError2")
                      : t("SignUp:confirmPasswordError3")
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
            {t("SignUp:submitButtonText")}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
              {t("SignUp:signInLinkText")}
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
