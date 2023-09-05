import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CssBaseline,
  Grid,
  Skeleton,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import Alert from "./../components/Alert";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as logger from "../utils/logger";
import * as userService from "../services/user";
import { userAction } from "../store/user";
import { useTranslation } from "react-i18next";
import ChangePasswordDialog from "../components/ChangePasswordDialog";

const UserAccount = (props) => {
  const { t } = useTranslation(["common", "UserAccount"]);
  const dispatch = useDispatch();
  // Processing variables
  const [loading, setLoading] = React.useState(true);

  const userData = useSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    if (userData.email) {
      setLoading(false);
    }
  }, [userData]);
  const [editMode, setEditMode] = useState(false);
  const changeEditMode = (value) => {
    setEditMode(value);
  };
  //Form
  const {
    getValues,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ values: userData });

  // Alert variables
  const [alertOpen, setAlertOpen] = React.useState(false);
  const openAlert = () => {
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);
  };
  const [alertSeverity, setAlertSeverity] = React.useState("success");
  const [alertMessage, setAlertMessage] = React.useState("");

  const handleSubmitForm = async (formData) => {
    logger.group("Update form submit");
    logger.log(formData);
    logger.groupEnd();

    changeEditMode(false);
    setLoading(false);

    const formValues = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      imageUrl: formData.imageUrl,
      bio: formData.bio,
    };

    try {
      const response = await userService.updateUserData(formValues);

      if (response.data.success) {
        // Updating the state
        dispatch(userAction.updateUser(formValues));
        // Alert message
        setAlertSeverity("success");
        setAlertMessage(t("UserAccount:alertSuccess"));
        setLoading(false);
        openAlert();
        // RESET FORM
        reset();
      } else {
        setAlertSeverity("error");
        setAlertMessage(t("UserAccount:alertFail"));
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
  const imageChanged = async (event) => {
    const formData = new FormData();
    logger.log("Image changed");
    logger.log(event.target.files);
    logger.log(event.target.files[0]);
    formData.append("file", event.target.files[0]);
    // setSelectedImage(event.target.files[0]);
    // Upload Image to S3
    try {
      const response = await userService.uploadImage(formData);
      logger.log("Response in component");
      logger.log(response);
      const imageUrl = response.data.data.fileLocation;
      // Update form
      setValue("imageUrl", imageUrl);
      // Set alert
      setAlertSeverity("success");
      setAlertMessage(t("UserAccount:alertUpdated"));
      openAlert();
    } catch (err) {
      logger.log("err");
      logger.log(err);
      setAlertSeverity("error");
      setAlertMessage(err.message);
      openAlert();
    }
  };
  const [selectedImage, setSelectedImage] = useState(undefined);

  // Handle change password dialog
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
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
            {t("UserAccount:heading")}
          </Typography>

          <Avatar
            src={getValues.call().imageUrl}
            sx={{
              width: "100px",
              height: "100px",
              border: `2px solid grey`,
            }}
          />
          <br />
          {editMode && (
            <span>
              {selectedImage}
              <Button variant="contained" color="secondary" component="label">
                {t("UserAccount:displayPictureButtonText")}
                <EditIcon sx={{ width: 17 }} />
                <input hidden type="file" onChange={imageChanged} />
              </Button>
            </span>
          )}
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
                    label={t("UserAccount:firstNameLabel")}
                    fullWidth
                    error={Boolean(errors.firstName)}
                    helperText={
                      errors.firstName ? t("UserAccount:firstNameError") : ""
                    }
                    // defaultValue={userData.firstName}
                    disabled={!editMode}
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
                    {...register("lastName", {
                      required: true,
                    })}
                    label={t("UserAccount:lastNameLabel")}
                    fullWidth
                    error={Boolean(errors.lastName)}
                    helperText={
                      errors.lastName ? t("UserAccount:lastNameError") : ""
                    }
                    disabled={!editMode}
                    // defaultValue={userData.lastName}
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
                    label={t("UserAccount:emailLabel")}
                    fullWidth
                    error={Boolean(errors.email)}
                    helperText={errors.email ? t("UserAccount:emailError") : ""}
                    disabled
                    // defaultValue={userData.email}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                {!loading && editMode && (
                  <TextField
                    {...register("imageUrl", {
                      required: true,
                      minLength: 6,
                    })}
                    type="text"
                    label="Image url"
                    fullWidth
                    error={Boolean(errors.imageUrl)}
                    style={{ display: "none" }}
                    // defaultValue={userData.imageUrl}
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
                    {...register("bio", {
                      required: true,
                      minLength: 6,
                    })}
                    type="text"
                    label={t("UserAccount:bioLabel")}
                    fullWidth
                    disabled={!editMode}
                    // defaultValue={userData.bio}
                  />
                )}
              </Grid>
            </Grid>
            {editMode && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                onClick={() => handleSubmitForm(getValues.call())}
              >
                {t("UserAccount:submitButtonText")}
              </Button>
            )}
            {editMode && (
              <Button
                fullWidth
                variant="outlined"
                disabled={loading}
                color="error"
                onClick={() => {
                  changeEditMode(false);
                }}
              >
                {t("common:cancel")}
              </Button>
            )}
            {/* Edit button */}
            <br />
            {!editMode && (
              <Button
                variant="contained"
                onClick={() => {
                  changeEditMode(true);
                }}
                fullWidth
              >
                {t("UserAccount:editButtonText")}
              </Button>
            )}
            <br />
            <br />
            {/* Change password button */}
            {!editMode && (
              <Button
                variant="contained"
                onClick={handleClickOpenDialog}
                fullWidth
              >
                {t("UserAccount:changePasswordButtonText")}
              </Button>
            )}
          </Box>
        </Box>

        <ChangePasswordDialog
          handleSubmit={() => {}}
          handleClose={handleCloseDialog}
          open={openDialog}
          // Alert methods
          openAlert={openAlert}
          setAlertSeverity={setAlertSeverity}
          setAlertOpen={setAlertOpen}
          setAlertMessage={setAlertMessage}
        />
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

export default UserAccount;
