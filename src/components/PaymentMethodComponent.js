import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Grid, Stack, ListItem, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import * as logger from "./../utils/logger";
import { retrievePaymentMethod } from "./../services/payments";

const PaymentMethodComponent = (props) => {
  const { t } = useTranslation(["common", "Membership"]);
  const userSubscription = useSelector((state) => {
    return state.subscription;
  });
  const changePaymentClicked = () => {
    props.changePaymentClicked();
  };
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  useEffect(() => {
    setPaymentMethodId(userSubscription.default_payment_method);
  }, [userSubscription]);
  useEffect(() => {
    // Retrieve payment method
    const getPaymentMethod = async (paymentMethodId) => {
      const retrievedPaymentMethod = await retrievePaymentMethod(
        paymentMethodId
      );
      setPaymentMethod(retrievedPaymentMethod.paymentMethod);
    };
    if (paymentMethodId) getPaymentMethod(paymentMethodId);
  }, [paymentMethodId]);
  return (
    <div>
      {userSubscription.default_payment_method && (
        <Grid>
          <Card variant="outlined" style={{ margin: "10px auto" }}>
            <h2>{t("Membership:paymentMethod")}</h2>
            <Stack spacing={2}>
              <ListItem>
                <strong>{`${paymentMethod?.type}: `}</strong>
                <span> </span> {paymentMethod?.card?.brand}
                ************{paymentMethod?.card?.last4}
              </ListItem>
              <ListItem>
                <Button
                  variant="text"
                  color="primary"
                  onClick={changePaymentClicked}
                >
                  {t("Membership:changePaymentMethod")}
                </Button>
              </ListItem>
            </Stack>
            <br />
            <br />
          </Card>
        </Grid>
      )}
    </div>
  );
};
export default PaymentMethodComponent;
