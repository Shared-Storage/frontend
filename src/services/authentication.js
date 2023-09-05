import axios from "axios";
import * as logger from "../utils/logger";

export const signup = async (
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) => {
  // Check if password are same?
  if (password !== confirmPassword) return;
  const data = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  };

  try {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/auth/signup",
      data: data,
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/auth/forgot-password",
      data: { email: email },
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};

export const verifyForgotPassword = async (newPassword, tokenToVerify) => {
  try {
    const response = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK + "/v1/auth/verify-forgot-password",
      data: { tokenToVerify, newPassword },
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};

export const login = async (email, password) => {
  const data = {
    email,
    password,
  };

  try {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/auth/login",
      data: data,
    });
    // Set token in localstorage
    localStorage.setItem("token", response.data.token);
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};

export const logout = async (email, password) => {
  // Set token in localstorage
  localStorage.removeItem("token");
};

export const verifyEmail = async (tokenToBeVerified) => {
  try {
    return await axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/auth/verify-email",
      data: { tokenToBeVerified },
    });
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const resendEmailVerification = async (email) => {
  try {
    return await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK +
        "/v1/auth/resend-email-verification",
      data: { email },
    });
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const updatePassword = async (
  currentPassword,
  newPassword,
  confirmNewPassword
) => {
  try {
    if (newPassword !== confirmNewPassword) return;
    return await axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/auth/update-password",
      data: { currentPassword, newPassword },
    });
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};
