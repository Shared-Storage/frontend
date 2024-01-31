import axios from "axios";
import * as logger from "../utils/logger";

export const createLocation = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_STORAGE_SERVICE_BACKEND_LINK + "/v1/location/",
      data: {
        name: data.name,
        organizationId: data.organizationId,
        imageUrl: data?.imageUrl,
        description: data?.description,
      },
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};

export const createItem = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_STORAGE_SERVICE_BACKEND_LINK + "/v1/item",
      data: {
        organizationId: data.organizationId,
        locationId: data?.locationId,
        name: data.name,
        imageUrl: data.imageUrl,
        description: data?.description,
        tags: data?.tags,
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
        "/v1/location/org/" +
        data.organizationId,
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};

export const getItemsByOrganization = async (data) => {
  try {
    const response = await axios({
      method: "get",
      url:
        process.env.REACT_APP_STORAGE_SERVICE_BACKEND_LINK +
        "/v1/item/org/" +
        data.organizationId,
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};
