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
import { Skeleton } from "@mui/material";
import { useForm } from "react-hook-form";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Copyright from "../components/Copyright";
import * as authenticationServive from "../services/authentication";
import Alert from "./../components/Alert";
import * as logger from "../utils/logger";
import { authenticationAction } from "../store/auth";
import { useDispatch } from "react-redux";
import { userAction } from "../store/user";
import { preferenceAction } from "../store/preferences";
import { paymentsAction } from "../store/payments";
import { subscriptionAction } from "../store/subscription";
import { extractPlanFromSubscriptions } from "./../services/payments";

// TODO remove, this demo shouldn't need to reset the theme.

export default function SignInSide() {
  const { t } = useTranslation(["common", "SignIn"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleSubmitForm = async (formData) => {
    logger.group("Signin form submit");
    logger.log(formData);
    logger.groupEnd();

    setLoading(true);

    const formValues = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await authenticationServive.login(
        formValues.email,
        formValues.password
      );

      if (response.data.success) {
        setAlertSeverity("success");
        setAlertMessage(t("SignIn:successMessageOnFormSubmit"));
        setLoading(false);
        openAlert();
        // RESET FORM
        reset();
        // Set state

        logger.log("Incoming data on log in response.data.userData");
        logger.log(response.data.userData);

        dispatch(authenticationAction.login());
        dispatch(userAction.setUser(response.data.userData));
        // Set subscription state
        const subscriptionDetails = await extractPlanFromSubscriptions(
          response.data.userData?.subscriptions
        );

        dispatch(subscriptionAction.setSubscription(subscriptionDetails));
        // Set billing state
        dispatch(
          paymentsAction.setBillingDetails(response.data.userData?.payments)
        );

        if (response.data.userData?.preferences) {
          dispatch(
            preferenceAction.setUserPreference(
              response.data.userData?.preferences
            )
          );
        }
        // Route to dashboard
        navigate("/dashboard");
      } else {
        setAlertSeverity("error");
        setAlertMessage(t("SignIn:errorMessageOnFormSubmit"));
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
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(background.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {t("SignIn:signIn")}
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit((data) => handleSubmitForm(data))}
              sx={{ mt: 1 }}
            >
              <Grid container spacing={2}>
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
                      label={t("SignIn:emailLabel")}
                      fullWidth
                      error={Boolean(errors.email)}
                      helperText={errors.email ? t("SignIn:invalidEmail") : ""}
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
                      {...register("password", {
                        required: true,
                        minLength: 6,
                      })}
                      type="password"
                      label={t("SignIn:passwordLabel")}
                      fullWidth
                      error={Boolean(errors.password)}
                      helperText={
                        errors.password ? t("SignIn:invalidPassword") : ""
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
                {t("SignIn:signInButtonText")}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="forgot-password" variant="body2">
                    {t("SignIn:forgotPasswordLinkText")}
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="signup" variant="body2">
                    {t("SignIn:signUpLinkText")}
                  </Link>
                </Grid>
              </Grid>
              <Grid item>
                <Link href="support" variant="body2">
                  {t("SignIn:supportLinkText")}
                </Link>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* Error, info, warning and success */}
      <Alert severity={alertSeverity} open={alertOpen} message={alertMessage} />
    </>
  );
}
