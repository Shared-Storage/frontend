import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import {
  createSetupIntent,
  updateSubscriptionPaymentMethod,
} from "./../services/payments";
import * as logger from "./../utils/logger";
import { subscriptionAction } from "../store/subscription";
import { useTranslation } from "react-i18next";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PaymentForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "Membership"]);

  const userSubscription = useSelector((state) => {
    return state.subscription;
  });
  const [errorMessage, setErrorMessage] = React.useState(null);
  const createStripePaymentMethod = async () => {
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }
    setErrorMessage(null);
    const resp = await stripe.createPaymentMethod({
      elements,
    });
    return resp;
  };
  const handleSubmit = async (event) => {
    logger.log("Submit pressed");
    event.preventDefault();
    const resp = await createStripePaymentMethod();
    const paymentMethodId = resp?.paymentMethod?.id;
    const response = await updateSubscriptionPaymentMethod(
      userSubscription.subscriptionId,
      userSubscription.customer,
      paymentMethodId
    );
    logger.log(response?.data?.updated);
    if (response?.data?.updated) {
      // Update state
      dispatch(subscriptionAction.updateDefaultPaymentMethod(paymentMethodId));
      props.handleClose();
    } else {
      // Show error
      logger.error("Unable to update subscription with new payment id");
    }
  };

  return (
    <>
      <div style={{ display: "block", margin: "auto" }}>
        <form onSubmit={handleSubmit}>
          <PaymentElement />
        </form>
        <div style={{ color: "red" }}>{errorMessage}</div>
        <Button variant="contained" onClick={handleSubmit}>
          {t("Membership:updatePaymentMethod")}
        </Button>
      </div>
    </>
  );
};

const ChangePaymentMethodDialog = (props) => {
  const { t } = useTranslation(["common", "Membership"]);
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );
  const [options, setOptions] = React.useState({
    paymentMethodCreation: "manual",
    appearance: { theme: "stripe" },
  });
  const [clientSecret, setClientSecret] = React.useState(null);
  const userPreferences = useSelector((state) => {
    return state.preferences;
  });
  React.useEffect(() => {
    setOptions({
      clientSecret: clientSecret,
      paymentMethodCreation: "manual",
      appearance: {
        theme: userPreferences.theme === "dark" ? "night" : "stripe",
      },
    });
  }, [clientSecret, userPreferences.theme]);

  React.useEffect(() => {
    const getSetupIntent = async () => {
      const response = await createSetupIntent();
      setClientSecret(response.client_secret);
    };
    getSetupIntent();
  }, []);

  return (
    <div>
      <Dialog
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {t("Membership:changePaymentMethod")}
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={props.handleClose}>
              save
            </Button> */}
          </Toolbar>
        </AppBar>
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm handleClose={props.handleClose} />
        </Elements>
      </Dialog>
    </div>
  );
};

export default ChangePaymentMethodDialog;
