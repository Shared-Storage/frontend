import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Button, Box } from "@mui/material";

import Alert from "./../Alert";
import * as logger from "./../../utils/logger";
import { submitBillingAddress } from "./../../services/payments";
import { paymentsAction } from "./../../store/payments";

export default function AddressForm(props) {
  const dispatch = useDispatch();
  const paymentsDataBillingDetails = useSelector((state) => {
    return state.payments.billingDetails;
  });
  //Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm({
    values: {
      fullName: paymentsDataBillingDetails?.billingName,
      phone: paymentsDataBillingDetails?.billingPhone,
      addressLineOne:
        paymentsDataBillingDetails?.billingAddress?.addressLineOne,
      addressLineTwo:
        paymentsDataBillingDetails?.billingAddress?.addressLineTwo,
      province: paymentsDataBillingDetails?.billingAddress?.province,
      city: paymentsDataBillingDetails?.billingAddress?.city,
      zip: paymentsDataBillingDetails?.billingAddress?.zip,
      country: paymentsDataBillingDetails?.billingAddress?.country,
    },
  });

  // Alert variables
  const [alertOpen, setAlertOpen] = React.useState(false);
  const openAlert = () => {
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);
  };
  const [alertSeverity, setAlertSeverity] = React.useState("success");
  const [alertMessage, setAlertMessage] = React.useState("");

  const handleSubmitForm = async (data, event) => {
    logger.log("Data retrieved");
    logger.log(data);
    // Send it to backend to update stripe and database
    const response = await submitBillingAddress(data);
    logger.log("Final response");
    logger.log(response);
    if (response?.data?.success) {
      // If database is successfully updated then update the state
      // Set billing state
      const stateObject = {
        billingDetails: {
          billingName: data.fullName,
          billingPhone: data.phone,
          billingAddress: {
            addressLineOne: data.addressLineOne,
            addressLineTwo: data.addressLineTwo,
            city: data.city,
            country: data.country,
            province: data.province,
            zip: data.zip,
          },
        },
      };
      dispatch(paymentsAction.setBillingDetails(stateObject));
      props.handleNext();
    } else {
      // Show error
      setAlertMessage("Error in saving billing address");
      setAlertSeverity("error");
      openAlert();
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Billing address
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit((data) => handleSubmitForm(data))}
        sx={{ mt: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("fullName", { required: true, minLength: 1 })}
              required
              label="Full name"
              fullWidth
              variant="standard"
              error={Boolean(errors.fullName)}
              helperText={errors.fullName ? "Name error" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("phone")}
              label="Phone"
              fullWidth
              variant="standard"
              error={Boolean(errors.phone)}
              helperText={errors.phone ? "Phone error" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("addressLineOne", { required: true, minLength: 1 })}
              required
              label="Address line 1"
              fullWidth
              variant="standard"
              error={Boolean(errors.addressLineOne)}
              helperText={errors.addressLineOne ? "addressLineOne error" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("addressLineTwo")}
              label="Address line 2"
              fullWidth
              variant="standard"
              error={Boolean(errors.addressLineTwo)}
              helperText={errors.addressLineTwo ? "addressLineTwo error" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("city", { required: true, minLength: 1 })}
              required
              label="City"
              fullWidth
              variant="standard"
              error={Boolean(errors.city)}
              helperText={errors.city ? "City error" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("province", { required: true, minLength: 1 })}
              required
              label="Province"
              fullWidth
              variant="standard"
              error={Boolean(errors.province)}
              helperText={errors.province ? "province error" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("zip", { required: true, minLength: 1 })}
              required
              label="Pincode / Zip"
              fullWidth
              variant="standard"
              error={Boolean(errors.zip)}
              helperText={errors.zip ? "zip error" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register("country", { required: true, minLength: 1 })}
              required
              label="Country"
              fullWidth
              variant="standard"
              error={Boolean(errors.country)}
              helperText={errors.country ? "country error" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox color="secondary" name="saveAddress" value="yes" />
              }
              label="Use this address for payment details"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit((data) => handleSubmitForm(data))}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* Error, info, warning and success */}
      <Alert severity={alertSeverity} open={alertOpen} message={alertMessage} />
    </React.Fragment>
  );
}
