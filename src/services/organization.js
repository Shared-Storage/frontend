import axios from "axios";
import * as logger from "../utils/logger";
import { createLocation } from "./storage";

export const createOrganization = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK +
        "/v1/organization/create-organization",
      data: {
        title: data.title,
        description: data.description,
        img: data.img,
        orgMembers: data.orgMembers,
      },
    });
    // Create location in storage
    data.orgLocations.forEach(async (location) => {
      await createLocation({
        ...location,
        organizationId: response?.data?.organization?._id,
      });
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
      url:
        process.env.REACT_APP_BACKEND_LINK +
        "/v1/organization/get-organizations",
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};

export const getOrganizationFromId = async (organizationId) => {
  try {
    const response = await axios({
      method: "get",
      url:
        process.env.REACT_APP_BACKEND_LINK +
        `/v1/organization/get-organization/${organizationId}`,
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};

export const acceptInvitationToOrganization = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK +
        "/v1/organization/accept-invitation",
      data: { ...data },
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};

export const declineInvitationToOrganization = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url:
        process.env.REACT_APP_BACKEND_LINK +
        "/v1/organization/decline-invitation",
      data: { ...data },
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};
