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
  ButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { Skeleton } from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";

import * as organizationService from "../../services/organization";
import * as logger from "../../utils/logger";
import { FormGroup } from "@mui/material";

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

export default function CreateOrganizationDialog(props) {
  const { t } = useTranslation(["common", "ChangePasswordDialog"]);
  //Form

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      title: null,
      description: null,
      orgMembers: [],
      orgLocations: [
        { name: "Living room" },
        { name: "Bedroom" },
        { name: "Kitchen" },
        { name: "Storage" },
        { name: "Office desk" },
      ],
    },
  });

  const orgMembersObject = useFieldArray({
    name: "orgMembers",
    control,
  });
  const orgLocationsObject = useFieldArray({
    name: "orgLocations",
    control,
  });

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

  const handleSubmitForm = async (formData) => {
    logger.log("Create organization form submit");
    logger.log(formData);
    logger.groupEnd();

    try {
      await organizationService.createOrganization(formData);

      props.refreshOrganizations();

      props.setAlertSeverity("success");
      props.setAlertMessage(t("ChangePasswordDialog:alertSuccess"));
      setLoading(false);
      props.setAlertOpen();
      // RESET FORM
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

    // const formValues = {
    //   currentPassword: formData.currentPassword,
    //   newPassword: formData.newPassword,
    //   confirmNewPassword: formData.confirmNewPassword,
    // };
    // try {
    //   const response = await authenticationServive.updatePassword(
    //     formValues.currentPassword,
    //     formValues.newPassword,
    //     formValues.confirmNewPassword
    //   );
    //   logger.log("response:)");
    //   logger.log(response);
    //   logger.log(response.status);
    //   if (response?.data?.success) {
    //     // Close the dialog
    //     cancelMethod();

    //     props.setAlertSeverity("success");
    //     props.setAlertMessage(t("ChangePasswordDialog:alertSuccess"));
    //     setLoading(false);
    //     props.openAlert();
    //     // RESET FORM
    //     reset();
    //   } else {
    //     // Close the dialog
    //     cancelMethod();

    //     props.setAlertSeverity("error");
    //     props.setAlertMessage(
    //       response?.response?.data?.errorMessage
    //         ? response?.response?.data?.errorMessage
    //         : t("ChangePasswordDialog:alertFail")
    //     );
    //     setLoading(false);
    //     props.openAlert();
    //   }
    // } catch (error) {
    //   // Close the dialog
    //   cancelMethod();

    //   props.setAlertSeverity("error");
    //   props.setAlertMessage(error.message);
    //   setLoading(false);
    //   props.openAlert();
    // }
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
          Create Organization
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
                    {...register("title", {
                      required: true,
                    })}
                    type="text"
                    label={"Title"}
                    fullWidth
                    error={Boolean(errors.title)}
                    helperText={errors.title ? "Title error" : ""}
                    placeholder="Home"
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
                    {...register("description")}
                    type="text"
                    label={"Description"}
                    fullWidth
                    error={Boolean(errors.description)}
                    helperText={errors.description ? "Description error" : ""}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <h3>Organization Members</h3>
                {orgMembersObject.fields.map((field, index) => {
                  return (
                    <section key={field.id} style={{ padding: "10px 0" }}>
                      <FormGroup row={true}>
                        <TextField
                          type="email"
                          label={"Email"}
                          {...register(`orgMembers.${index}.email`)}
                          style={{ margin: "5px", width: "70%" }}
                          size="small"
                        />
                        <TextField
                          type="text"
                          label={"Status"}
                          {...register(`orgMembers.${index}.status`)}
                          disabled
                          style={{ margin: "5px", display: "none" }}
                          size="small"
                        />
                        <Button
                          disabled={loading}
                          variant="text"
                          color="error"
                          onClick={() => {
                            orgMembersObject.remove(index);
                          }}
                          style={{ verticalAlign: "middle" }}
                        >
                          <HighlightOffIcon />
                        </Button>
                      </FormGroup>
                    </section>
                  );
                })}
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    disabled={loading}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      orgMembersObject.append({
                        email: "",
                        status: "pending",
                      });
                    }}
                  >
                    <AddIcon />
                    ADD Member
                  </Button>
                </ButtonGroup>
                <h3>Locations</h3>
                {orgLocationsObject.fields.map((field, index) => {
                  return (
                    <section key={field.id} style={{ padding: "10px 0" }}>
                      <FormGroup row={true}>
                        <TextField
                          type="text"
                          label={"Name"}
                          {...register(`orgLocations.${index}.name`)}
                          style={{ margin: "5px", width: "70%" }}
                          size="small"
                        />
                        <Button
                          disabled={loading}
                          variant="text"
                          color="error"
                          onClick={() => {
                            orgLocationsObject.remove(index);
                          }}
                          style={{ verticalAlign: "middle" }}
                        >
                          <HighlightOffIcon />
                        </Button>
                      </FormGroup>
                    </section>
                  );
                })}
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    disabled={loading}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      orgLocationsObject.append({
                        name: "",
                      });
                    }}
                  >
                    <AddIcon />
                    ADD Locations
                  </Button>
                </ButtonGroup>
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
