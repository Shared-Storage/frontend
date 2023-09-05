import axios from "axios";
import * as logger from "./../utils/logger";

export const submitBillingAddress = async (billingDetails) => {
  //Send data to backend
  // Add billing details to Stripe
  // Add billing details to database
  const billingDetailsObject = {
    billingName: billingDetails?.fullName,
    billingPhone: billingDetails?.phone,
    billingAddress: {
      addressLineOne: billingDetails?.addressLineOne,
      addressLineTwo: billingDetails?.addressLineTwo,
      province: billingDetails?.province,
      city: billingDetails?.city,
      zip: billingDetails?.zip,
      country: billingDetails?.country,
    },
  };
  try {
    const response = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK +
        "/v1/payments/update-billing-details",
      data: { ...billingDetailsObject },
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};

export const getPlans = async () => {
  try {
    const response = await axios({
      method: "get",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/payments/get-plans",
    });
    return response?.data?.plans;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const createSubscription = async (membershipPlan) => {
  try {
    const response = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK + "/v1/payments/create-subscription",
      data: { membershipPlan: membershipPlan },
    });

    return response;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const getProductFromId = async (productId) => {
  try {
    const response = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK + "/v1/payments/get-product-from-id",
      data: { productId: productId },
    });
    return response?.data?.product;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const extractPlanFromSubscriptions = async (subscriptions) => {
  try {
    if (subscriptions.length >= 1) {
      const productId = subscriptions[0]?.plan?.product;
      const product = await getProductFromId(productId);
      return {
        customer: subscriptions[0]?.customer,
        subscriptionPlan: product?.metadata?.subscription,
        subscriptionId: subscriptions[0]?.id,
        subscriptionItemId: subscriptions[0]?.items?.data[0]?.id,
        default_payment_method: subscriptions[0]?.default_payment_method,
        cancel_at: subscriptions[0]?.cancel_at,
        cancel_at_period_end: subscriptions[0]?.cancel_at_period_end,
        canceled_at: subscriptions[0]?.canceled_at,
      };
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK + "/v1/payments/cancel-subscription",
      data: { subscriptionId: subscriptionId },
    });
    return response?.data;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const resumeSubscription = async (subscriptionId) => {
  try {
    const response = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK + "/v1/payments/resume-subscription",
      data: { subscriptionId: subscriptionId },
    });
    return response?.data;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const updateSubscription = async (
  subscriptionId,
  subscriptionItemId,
  membershipPlan,
  paymentMethod
) => {
  try {
    const resp = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK + "/v1/payments/update-subscription",
      data: { subscriptionId, subscriptionItemId, membershipPlan },
    });

    if (resp.data.updated) {
      return resp;
    } else {
      // show error
      logger.error("Couldn't update subscription");
      throw Error("Error in updating subscription");
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const updateSubscriptionPaymentMethod = async (
  subscriptionId,
  customerId,
  paymentMethod
) => {
  try {
    const resp = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK +
        "/v1/payments/update-subscription-payment-method",
      data: { subscriptionId, customerId, paymentMethod },
    });

    if (resp.data.updated) {
      return resp;
    } else {
      // show error
      logger.error("Couldn't update subscription");
      throw Error("Couldn't update subscription");
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const retrievePaymentMethod = async (paymentMethodId) => {
  try {
    const resp = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK +
        "/v1/payments/retrieve-payment-method",
      data: { paymentMethodId: paymentMethodId },
    });
    return resp.data;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const getInvoicesForCustomer = async (customerId) => {
  try {
    const resp = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK +
        "/v1/payments/get-invoices-for-customer",
      data: { customerId: customerId },
    });
    return resp.data;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const createSetupIntent = async () => {
  try {
    const resp = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK + "/v1/payments/create-setup-intent",
    });
    return resp.data;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
