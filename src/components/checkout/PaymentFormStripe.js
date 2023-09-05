import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { createSubscription } from "../../services/payments";
import * as logger from "../../utils/logger";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    logger.log("Handle payment confirm");
    logger.log("Client secret: " + props.clientSecret);
    logger.log("Subscription id: " + props.subscriptionId);
    event.preventDefault();
    if (props.clientSecret && props.subscriptionId) {
      logger.log("Within if clause");
      if (elements == null) {
        return;
      }
      logger.log("After element");

      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        // Show error to your customer
        setErrorMessage(submitError.message);
        return;
      }

      const { error } = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        // clientSecret,
        confirmParams: {
          return_url: "http://localhost:3000",
        },
      });

      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        logger.error("Payment error");
        setErrorMessage(error.message);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
        logger.log("Payment successful");
      }
    } else {
      // show error
      logger.error("Either subscriptionid or clientSecret not set");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Grid item xs={12}>
        <FormControlLabel
          control={<Checkbox color="secondary" name="saveCard" value="yes" />}
          label="Remember credit card details for next time"
        />
      </Grid>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3, ml: 1 }}
        type="submit"
        disabled={!stripe || !elements}
      >
        Pay
      </Button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentFormStripe = () => {
  const { state } = useLocation();
  const { membershipPlan } = state;

  const userPreferences = useSelector((state) => {
    return state.preferences;
  });

  const [clientSecret, setClientSecret] = useState(undefined);
  const [subscriptionId, setSubscriptionId] = useState(undefined);
  const [options, setOptions] = useState({ appearance: { theme: "stripe" } });

  useEffect(() => {
    const setSubscriptionDetails = async () => {
      const response = await createSubscription(membershipPlan);
      setClientSecret(response?.data?.clientSecret);
      setSubscriptionId(response?.data?.subscriptionId);
      logger.log("Setting client secret: " + response?.data?.clientSecret);
      setOptions({
        clientSecret: response?.data?.clientSecret,
        appearance: {
          theme: userPreferences.theme === "dark" ? "night" : "stripe",
        },
      });
    };
    setSubscriptionDetails();
  }, []);

  return (
    clientSecret &&
    subscriptionId && (
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm
          clientSecret={clientSecret}
          subscriptionId={subscriptionId}
        />
      </Elements>
    )
  );
};

export default PaymentFormStripe;
