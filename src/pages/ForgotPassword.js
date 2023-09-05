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
import * as logger from "../utils/logger";
import { useTranslation } from "react-i18next";

// TODO remove, this demo shouldn't need to reset the theme.
export default function ForgotPassword() {
  const { t } = useTranslation(["common", "ForgotPassword"]);
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
  const [alertSeverity, setAlertSeverity] = React.useState(t("ForgotPassword:alertSuccess"));
  const [alertMessage, setAlertMessage] = React.useState("");

  // Processing variables
  const [loading, setLoading] = React.useState(false);

  const handleSubmitForm = async (formData) => {
    logger.group("Forgot password form submit");
    logger.log(formData);
    logger.groupEnd();

    setLoading(true);

    const formValues = {
      email: formData.email,
    };
    try {
      const response = await authenticationServive.forgotPassword(
        formValues.email
      );

      if (response.data.success) {
        setAlertSeverity("success");
        setAlertMessage(t("ForgotPassword:alertSuccess"));
        setLoading(false);
        openAlert();
        // RESET FORM
        reset();
      } else {
        setAlertSeverity("error");
        setAlertMessage(t("ForgotPassword:alertFail"));
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
          {t("ForgotPassword:heading")}
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
                  {...register("email", {
                    required: true,
                    pattern:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  })}
                  label={t("ForgotPassword:emailLabel")}
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email ? t("ForgotPassword:emailError") : ""
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
            {t("ForgotPassword:submitButtonText")}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                {t("ForgotPassword:signInLinkText")}
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
