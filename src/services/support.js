import axios from "axios";
import * as logger from "../utils/logger";

export const submit = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_LINK + "/v1/support/submit",
      data: {
        email: data.email,
        problem: data.problem,
        authenticated: data.authenticated,
      },
    });
    return response;
  } catch (error) {
    logger.error(error);
    throw Error(error.message);
  }
};
