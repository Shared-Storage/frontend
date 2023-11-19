import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useLocation } from "react-router-dom";
import * as logger from "./../utils/logger";

import AddressForm from "../components/checkout/AddressForm";
import Review from "../components/checkout/Review";
import PaymentFormStripe from "../components/checkout/PaymentFormStripe";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Shared storage
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const steps = ["Review your order", "Billing address", "Payment details"];

export default function Checkout() {
  // Read values passed on state from useNavigate in Membership.js
  const { state } = useLocation();
  const { membershipPlan } = state;

  React.useEffect(() => {
    logger.log("MembershipPlan State in checkout:" + membershipPlan);
  }, []);

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <Review />;
      case 1:
        return <AddressForm handleNext={handleNext} handleBack={handleBack} />;
      case 2:
        return <PaymentFormStripe />;
      default:
        throw new Error("Unknown step");
    }
  }

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              {/* <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Typography> */}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                {activeStep !== 2 && (
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === 0
                      ? "Next"
                      : activeStep === 1
                      ? "Skip"
                      : null}
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </Paper>
        <Copyright />
      </Container>
    </>
  );
}
