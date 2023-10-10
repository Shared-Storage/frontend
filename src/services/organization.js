import axios from "axios";
import * as logger from "../utils/logger";

export const createOrganization = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/organization/create-organization",
      data: {
        title: data.title,
        description: data.description,
        img: data.img,
        orgMembers: data.orgMembers,
        orgLocations: data.orgLocations,
      },
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};
export const getUserOrganizations = async (data) => {
  try {
    const response = await axios({
      method: "get",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/organization/get-organizations"
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};
