import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  CssBaseline,
  Grid,
  Skeleton,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import Alert from "./../components/Alert";
import { Controller, useForm } from "react-hook-form";
import * as logger from "./../utils/logger";
import * as userService from "../services/user";
import { preferenceAction } from "../store/preferences";
import { useTranslation } from "react-i18next";
import { languageList } from "../utils/LanguageList";

const UserPreferences = (props) => {
  const { t } = useTranslation(["common", "UserPreferences"]);
  const dispatch = useDispatch();
  // Processing variables
  const [loading, setLoading] = React.useState(true);

  const userPreferences = useSelector((state) => {
    return state.preferences;
  });
  const [preferences, setPreference] = useState({
    theme: "light",
    language: "en",
  });
  useEffect(() => {
    if (
      userPreferences.theme !== undefined &&
      userPreferences.language !== undefined
    ) {
      if (userPreferences?.theme || userPreferences?.language) {
        setPreference(userPreferences);
      }
      setLoading(false);
    }
  }, [userPreferences]);

  //Form
  const {
    getValues,
    setValue,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ values: preferences });

  // Alert variables
  const [alertOpen, setAlertOpen] = React.useState(false);
  const openAlert = () => {
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);
  };
  const [alertSeverity, setAlertSeverity] = React.useState("success");
  const [alertMessage, setAlertMessage] = React.useState("");

  const handleSubmitForm = async (formData) => {
    logger.log("Submit");
    logger.log(formData);
    try {
      const response = await userService.updatePreferencesData(formData);
      logger.log("response in handle submit");
      logger.log(response);
      logger.log("formData in handle submit");
      logger.log(formData);
      // Updating state
      dispatch(preferenceAction.updatePreferences(formData));
      // Alert
      setAlertSeverity("success");
      setAlertMessage(t("UserPreferences:alertSuccess"));
      openAlert();
    } catch (error) {
      logger.error("error occurreed");
      logger.error(error);
      // Alert
      setAlertSeverity("error");
      setAlertMessage(error.message);
      openAlert();
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {t("UserPreferences:preferences")}
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
                  <span>
                    <Controller
                      control={control}
                      name="theme"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          select
                          fullWidth
                          label={t("UserPreferences:themeLabel")}
                          defaultValue={preferences.theme}
                          inputProps={register("theme")}
                          error={errors.theme}
                          helperText={errors.theme?.message}
                        >
                          <MenuItem value={"light"}>
                            {t("UserPreferences:lightTheme")}
                          </MenuItem>
                          <MenuItem value={"dark"}>
                            {t("UserPreferences:darkTheme")}
                          </MenuItem>
                        </TextField>
                      )}
                    />
                  </span>
                )}
              </Grid>
              <Grid item xs={12}>
                {!loading && (
                  <span>
                    <TextField
                      select
                      fullWidth
                      label={t("UserPreferences:languageLabel")}
                      defaultValue={preferences.language}
                      inputProps={register("language")}
                      error={errors.language}
                      helperText={errors.language?.message}
                    >
                      {languageList.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </span>
                )}
              </Grid>
            </Grid>
            {
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                onClick={() => handleSubmitForm(getValues.call())}
              >
                {t("UserPreferences:submitButtonText")}
              </Button>
            }
          </Box>
        </Box>
        {/* Error, info, warning and success */}
        {alertOpen && (
          <Alert
            severity={alertSeverity}
            open={alertOpen}
            message={alertMessage}
          />
        )}
      </Container>
    </>
  );
};

export default UserPreferences;
