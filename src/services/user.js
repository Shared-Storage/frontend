import axios from "axios";
import * as logger from "../utils/logger";

export const getUserData = async () => {
  try {
    const response = await axios({
      method: "get",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/user/user-data",
      // data: { tokenToVerify, newPassword },
    });
    return response;
  } catch (error) {
    logger.error(error)
    throw Error(error.message);
  }
};

export const updateUserData = async (userData) => {
  try {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/user/update-user-data",
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        imageUrl: userData.imageUrl,
        bio: userData.bio,
      },
    });
    return response;
  } catch (error) {
    logger.error(error)
    throw Error(error.message);
  }
};

export const updatePreferencesData = async (preferences) => {
  try {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/user/update-preferences-data",
      data: {
        theme: preferences.theme,
        language: preferences.language,
      },
    });
    return response;
  } catch (error) {
    logger.error(error)
    throw Error(error.message);
  }
};

export const uploadImage = async (image) => {
  try {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/user/image-upload",
      data: image,
    });
    return response;
  } catch (err) {
    logger.error(err);
    throw Error(err.message);
  }
};
