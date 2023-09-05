import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../services/authentication";
import * as logger from "../utils/logger";
import { Skeleton } from "@mui/material";
import { Alert, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authenticationAction } from "../store/auth";
import { useTranslation } from "react-i18next";

const VerifyEmail = () => {
  const { t } = useTranslation(["common", "VerifyEmail"]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tokenToBeVerified = params.tokenToBeVerified;
  const [loading, setLoading] = useState(true);

  const [verifySuccessful, setVerifySuccessful] = useState(false);

  useEffect(() => {
    if (tokenToBeVerified) {
      verifyEmailMethod(tokenToBeVerified);
    }
  }, [tokenToBeVerified]);

  const verifyEmailMethod = async (token) => {
    try {
      const response = await verifyEmail(token);
      logger.log(response);
      setVerifySuccessful(true);
      setLoading(false);
      // Logout and Redirect
      setTimeout(() => {
        localStorage.removeItem("token");
        dispatch(authenticationAction.logout());
        navigate("/");
      }, 5000);
    } catch (err) {
      logger.error(err);
      setVerifySuccessful(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <h1>{t("VerifyEmail:heading")}</h1>
        {!loading && verifySuccessful && (
          <div>
            <Alert severity="success">{t("VerifyEmail:emailVerifiedSuccessMsg")}</Alert>
            <p>{t("VerifyEmail:redirectMsg")}</p>
          </div>
        )}
        {!loading && !verifySuccessful && (
          <Alert severity="error">{t("VerifyEmail:emailVerifiedFailMsg")}</Alert>
        )}
        {loading && (
          <Skeleton width="100%">
            <Alert severity="info">{t("VerifyEmail:alertMsg")}</Alert>
          </Skeleton>
        )}
      </Container>
    </>
  );
};

export default VerifyEmail;
