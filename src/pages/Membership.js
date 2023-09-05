import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PaymentMethodComponent from "../components/PaymentMethodComponent";
import Alert from "./../components/Alert";

import * as logger from "./../utils/logger";
import {
  getPlans,
  cancelSubscription,
  resumeSubscription,
  updateSubscription,
  extractPlanFromSubscriptions,
} from "../services/payments";
import { subscriptionAction } from "../store/subscription";
import CancelSubscriptionDialog from "./../components/CancelSubscriptionDialog";
import SubscribeFreePlanDialog from "./../components/SubscribeFreePlanDialog";
import UpdateSubscriptionPlanDialog from "./../components/UpdateSubscriptionPlanDialog";
import ChangePaymentMethodDialog from "./../components/ChangePaymentMethodDialog";
import InvoiceHistory from "../components/InvoiceHistory";

// TODO remove, this demo shouldn't need to reset the theme.

export default function Membership() {
  const { t } = useTranslation(["common", "Membership"]);
  const [tiers, updateTiers] = React.useState([]);

  const [openCancelSubscriptionDialog, setOpenCancelSubscriptionDialog] =
    React.useState(false);
  const [openFreePlanDialog, setOpenFreePlanDialog] = React.useState(false);
  const [openConfirmUpdateDialog, setOpenConfirmUpdateDialog] = React.useState({
    open: false,
    membershipPlan: undefined,
  });
  const [openUpdatePaymentDialog, setOpenUpdatePaymentDialog] = React.useState({
    open: false,
  });

  const handleCloseCancelSubscriptionDialog = () => {
    setOpenCancelSubscriptionDialog(false);
  };
  const handleCloseFreePlanDialog = () => {
    setOpenFreePlanDialog(false);
  };
  const handleCloseConfirmUpdateDialog = () => {
    setOpenConfirmUpdateDialog({ open: false, membershipPlan: undefined });
  };
  const handleCloseUpdatePaymentMethodDialog = () => {
    setOpenUpdatePaymentDialog({ open: false });
  };

  const dispatch = useDispatch();

  // Alert variables
  const [alertOpen, setAlertOpen] = React.useState(false);
  const openAlert = () => {
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);
  };
  const [alertSeverity, setAlertSeverity] = React.useState(
    t("Membership:alertSuccess")
  );
  const [alertMessage, setAlertMessage] = React.useState("");

  React.useEffect(() => {
    const getPlansMethod = async () => {
      try {
        const plans = await getPlans();
        updateTiers(plans);
      } catch (err) {
        logger.error(err);
        setAlertSeverity("error");
        setAlertMessage(err.message);
        openAlert();
      }
    };
    getPlansMethod();
  }, []);

  const userSubscription = useSelector((state) => {
    return state.subscription;
  });
  const navigate = useNavigate();

  const resumeSubscriptionClicked = async () => {
    try {
      logger.log("Resume subscription clicked");
      const response = await resumeSubscription(
        userSubscription.subscriptionId
      );
      if (response?.resumed) {
        logger.log("resumed");
        if (response?.subscriptionObject)
          dispatch(
            subscriptionAction.resetSubscription(response?.subscriptionObject)
          );
        else
          logger.log(
            "Show error, couldn't update subscription state after Resune"
          );
      } else {
        // Show error
        logger.error("Couldn't resume subscription");
      }
    } catch (err) {
      logger.error(err);
      setAlertSeverity("error");
      setAlertMessage(err.message);
      openAlert();
    }
  };
  const cancelCurrentSubscription = async () => {
    try {
      const response = await cancelSubscription(
        userSubscription.subscriptionId
      );
      if (response?.canceled) {
        logger.log("Canceled");
        if (response?.subscriptionObject)
          dispatch(
            subscriptionAction.resetSubscription(response?.subscriptionObject)
          );
        else
          logger.log(
            "Show error, couldn't update subscription state after cancellation"
          );
      } else {
        // Show error
        logger.error("Couldn't cancel subscription");
      }
    } catch (err) {
      logger.error(err);
      setAlertSeverity("error");
      setAlertMessage(err.message);
      openAlert();
    }
  };
  const cancelPressedInModal = async () => {
    cancelCurrentSubscription();
  };
  const cancelPressed = async () => {
    // Show modal
    setOpenCancelSubscriptionDialog(true);
  };
  const subscribePressed = async (membershipPlan) => {
    if (membershipPlan === "Free") {
      // open dialog showing you will automatically be sent here
      setOpenFreePlanDialog(true);
    } else navigate("/checkout", { state: { membershipPlan: membershipPlan } });
  };
  const updateSubscriptionPressed = async (membershipPlan) => {
    if (membershipPlan === "Free") {
      // open dialog showing you will automatically be sent here
      setOpenFreePlanDialog(true);
    } else {
      // open dialog confirming update membership
      setOpenConfirmUpdateDialog({
        open: true,
        membershipPlan: membershipPlan,
      });
    }
  };

  const updateSubscriptionConfirmed = async (
    subscriptionId,
    subscriptionItemId,
    membershipPlan
  ) => {
    try {
      const response = await updateSubscription(
        subscriptionId,
        subscriptionItemId,
        membershipPlan,
        userSubscription.default_payment_method
      );
      const subscriptionDetails = await extractPlanFromSubscriptions([
        response.data.subscription,
      ]);
      dispatch(subscriptionAction.setSubscription(subscriptionDetails));
      setOpenConfirmUpdateDialog({ open: false, membershipPlan: undefined });
    } catch (err) {
      logger.error(err);
      setAlertSeverity("error");
      setAlertMessage(err.message);
      openAlert();
    }
  };

  const changePaymentClicked = () => {
    logger.log("changePaymentClicked");
    setOpenUpdatePaymentDialog({ open: true });
  };
  return (
    <>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />

      {/* Hero unit */}
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <Typography
          component="h4"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
        >
          {t("Membership:membershipHeading")}
        </Typography>
        <Typography
          variant="p"
          align="center"
          color="text.secondary"
          component="p"
        >
          {t("Membership:membershipSubHeading")}
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === "Enterprise" ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={
                    tier.title === userSubscription.subscription &&
                    userSubscription.subscription !== "Free" ? (
                      userSubscription.cancel_at_period_end === true ? (
                        <span style={{ color: "red" }}>
                          {t("Membership:subscriptionCancelled")}
                        </span>
                      ) : (
                        <span style={{ color: "red" }}>{t("Membership:subscribed")}</span>
                      )
                    ) : null
                  }
                  titleTypographyProps={{ align: "center" }}
                  subheaderTypographyProps={{
                    align: "center",
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? theme.palette.grey[300]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      mb: 2,
                    }}
                  >
                    <Typography
                      component="h4"
                      variant="h4"
                      color="text.primary"
                    >
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /mo
                    </Typography>
                  </Box>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        - {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  {userSubscription.subscription === "Free" &&
                    tier.title === "Free" && (
                      <Button
                        fullWidth
                        variant="default"
                        disabled={tier.title === userSubscription.subscription}
                        onClick={subscribePressed.bind(this, tier.title)}
                      >
                        <span>{t("Membership:defaultSubscribed")}</span>
                      </Button>
                    )}

                  {tier.title === userSubscription.subscription &&
                    userSubscription.subscription !== "Free" &&
                    (userSubscription.cancel_at_period_end === true ? (
                      <div style={{ color: "grey" }}>
                        Subscription is cancelled (on{" "}
                        {new Date(
                          userSubscription.canceled_at * 1000
                        ).toLocaleDateString()}
                        ), you can still access this plan ({tier.title}) till
                        the end of billing period (
                        {new Date(
                          userSubscription.cancel_at * 1000
                        ).toLocaleDateString()}
                        )
                        <Button
                          fullWidth
                          variant="text"
                          color="info"
                          onClick={resumeSubscriptionClicked}
                        >
                          {t("Membership:reactivateSubscription")}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        fullWidth
                        variant="text"
                        color="error"
                        onClick={cancelPressed}
                      >
                        <span>{t("common:cancel")}</span>
                      </Button>
                    ))}
                  {tier.title !== userSubscription.subscription &&
                    (userSubscription.subscription === "Free" ||
                    userSubscription.cancel_at_period_end === true ? (
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={tier.title === userSubscription.subscription}
                        onClick={subscribePressed.bind(this, tier.title)}
                      >
                        <span>{t("Membership:subscribe")}</span>
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={tier.title === userSubscription.subscription}
                        onClick={updateSubscriptionPressed.bind(
                          this,
                          tier.title
                        )}
                      >
                        <span>{t("Membership:updateSubscription")}</span>
                      </Button>
                    ))}
                </CardActions>
              </Card>
            </Grid>
          ))}
          <CancelSubscriptionDialog
            open={openCancelSubscriptionDialog}
            handleClose={handleCloseCancelSubscriptionDialog}
            cancel={cancelPressedInModal}
          />
          <SubscribeFreePlanDialog
            open={openFreePlanDialog}
            handleClose={handleCloseFreePlanDialog}
          />
          <UpdateSubscriptionPlanDialog
            open={openConfirmUpdateDialog.open}
            membershipPlan={openConfirmUpdateDialog.membershipPlan}
            handleClose={handleCloseConfirmUpdateDialog}
            updateSubscription={updateSubscriptionConfirmed}
          />
          <ChangePaymentMethodDialog
            open={openUpdatePaymentDialog.open}
            membershipPlan={openConfirmUpdateDialog.membershipPlan}
            handleClose={handleCloseUpdatePaymentMethodDialog}
            updateSubscription={updateSubscriptionConfirmed}
          />
        </Grid>
        <br />
        <PaymentMethodComponent changePaymentClicked={changePaymentClicked} />
        <br />
        <InvoiceHistory />
        <br />
        <br />
        {/* Error, info, warning and success */}
        <Alert
          severity={alertSeverity}
          open={alertOpen}
          message={alertMessage}
        />
      </Container>
    </>
  );
}
