import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import {
  DialogActions,
  TextField,
  IconButton,
  DialogContent,
  DialogTitle,
  Dialog,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { Skeleton } from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";

// import * as organizationService from "../../services/organization";
import * as logger from "../../../utils/logger";
import {
  createItem,
  getLocationsByOrganization,
} from "../../../services/storage";

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

export default function CreateItemDialog(props) {
  const { t } = useTranslation(["common", "ChangePasswordDialog"]);
  const params = useParams();
  //Form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: null,
      imageUrl: null,
      description: "",
      locationId: null,
      tags: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });

  const [locations, setLocations] = React.useState([]);
  React.useEffect(() => {
    const getLocations = async () => {
      const response = await getLocationsByOrganization({
        organizationId: params?.organizationId,
      });

      setLocations(response?.data?.locations);
    };
    getLocations();
  }, [params?.organizationId]);

  // Processing variables
  const [loading, setLoading] = React.useState(false);

  const handleSubmitForm = async (formData) => {
    setLoading(true);
    logger.log("handleSubmitForm CreateItemDialog");
    logger.log(formData);
    try {
      const organizationId = params?.organizationId;

      if (organizationId) {
        // Create item
        const objectToBeSent = {
          ...formData,
          organizationId: organizationId,
        };
        await createItem(objectToBeSent);
      } else {
        // Display error
        logger.error("Couldn't retrieve organization id");
      }
      props.refreshItems();
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
    setLoading(false);
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
          Create Item
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
                    {...register("imageUrl", { required: true })}
                    type="text"
                    label={"Image uri"}
                    fullWidth
                    error={Boolean(errors.imageUrl)}
                    helperText={errors.imageUrl ? "imageUrl error" : ""}
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
                  <FormControl required fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Location
                    </InputLabel>
                    <Select
                      {...register("locationId", { required: true })}
                      error={Boolean(errors.locationId)}
                      defaultValue={0}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Location"
                    >
                      <MenuItem value={0} key={0}>
                        Select location
                      </MenuItem>
                      {locations.map((location) => {
                        return (
                          <MenuItem value={location._id} key={location._id}>
                            {location.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
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
                    defaultValue={""}
                    type="text"
                    label={"Description"}
                    fullWidth
                    error={Boolean(errors.description)}
                    helperText={errors.description ? "Image description" : ""}
                    multiline
                    rows={4}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                {loading ? (
                  <Skeleton variant="text" width="100%" height="150%">
                    <TextField />
                  </Skeleton>
                ) : (
                  <>
                    <h3>Tags</h3>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => append("")}
                    >
                      Add tag <AddIcon />
                    </Button>
                    <br />
                    {fields.map((item, index) => {
                      return (
                        <>
                          <OutlinedInput
                            key={item.id}
                            {...register(`tags.${index}`)}
                            defaultValue={""}
                            type="text"
                            error={Boolean(errors.tags)}
                            helperText={errors.tags ? "Error in tags" : ""}
                            style={{ marginTop: 5, marginRight: 5 }}
                            endAdornment={
                              <InputAdornment position="end">
                                <CloseIcon
                                  aria-label="toggle password visibility"
                                  onClick={() => remove(index)}
                                  edge="end"
                                  style={{ cursor: "pointer" }}
                                />
                              </InputAdornment>
                            }
                          />
                        </>
                      );
                    })}
                  </>
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
