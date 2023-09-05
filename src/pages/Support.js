import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CssBaseline,
  Grid,
  Skeleton,
  TextField,
  Button,
  Link,
} from "@mui/material";
import Alert from "./../components/Alert";

import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as logger from "../utils/logger";

import { useTranslation } from "react-i18next";
import * as supportService from "./../services/support";

const Support = (props) => {
  const { t } = useTranslation(["common", "Support"]);
  const isAuthenticated = useSelector((state) => {
    return state.auth.isAuthenticated;
  });
  const userData = useSelector((state) => {
    return state.user;
  });
  //Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ values: { email: userData.email } });

  // Alert variables
  const [alertOpen, setAlertOpen] = React.useState(false);
  const openAlert = () => {
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);
  };
  const [alertSeverity, setAlertSeverity] = React.useState(
    t("Support:alertSuccess")
  );
  const [alertMessage, setAlertMessage] = React.useState("");

  // Processing variables
  const [loading, setLoading] = React.useState(true);

  const handleSubmitForm = async (formData) => {
    logger.group("Support form submit");
    logger.log(formData);
    logger.groupEnd();

    setLoading(true);

    const formValues = {
      email: formData.email,
      problem: formData.problem,
    };
    try {
      const response = await supportService.submit({
        email: formValues.email,
        problem: formValues.problem,
        authenticated: isAuthenticated,
      });

      if (response?.data?.success) {
        setAlertSeverity("success");
        setAlertMessage(t("Support:alertSuccess"));
        setLoading(false);
        openAlert();
        // RESET FORM
        reset();
      } else {
        setAlertSeverity("error");
        setAlertMessage(
          response?.response?.data?.errorMessage
            ? response?.response?.data?.errorMessage
            : t("Support:alertFail")
        );
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

  useEffect(() => {
    logger.log("Support.js UseEffect");
    logger.log("userData.email");
    logger.log(userData.email);
    if (userData.email) {
    }
    setLoading(false);
  }, [userData]);
  return (
    <>
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
          <Typography component="h1" variant="h5">
            {t("Support:heading")}
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
                    label={t("Support:emailLabel")}
                    fullWidth
                    error={Boolean(errors.email)}
                    helperText={errors.email ? t("Support:emailError") : ""}
                    disabled={userData.email ? true : false}
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
                    {...register("problem", {
                      required: true,
                      minLength: 25,
                    })}
                    label={t("Support:problemLabel")}
                    fullWidth
                    error={Boolean(errors.problem)}
                    helperText={
                      errors.problem ? t("Support:problemLabelError") : ""
                    }
                    multiline
                    rows={4}
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
              {t("Support:submitButtonText")}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  {t("Support:signInLinkText")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Error, info, warning and success */}
        <Alert
          severity={alertSeverity}
          open={alertOpen}
          message={alertMessage}
        />
      </Container>
    </>
  );
};

export default Support;
