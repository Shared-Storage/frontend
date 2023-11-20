import axios from "axios";
import * as logger from "../utils/logger";

export const createLocation = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_STORAGE_SERVICE_BACKEND_LINK + "/location",
      data: {
        name: data.name,
        organization_id: data.organizationId,
        img: data?.img
      },
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};

export const getLocationsByOrganization = async (data) => {
  try {
    const response = await axios({
      method: "get",
      url:
        process.env.REACT_APP_STORAGE_SERVICE_BACKEND_LINK +
        "/locations/" +
        data.organizationId
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};
