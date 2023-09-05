import { Button, Container, Alert, Link } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as authenticationServive from "../services/authentication";

const EmailNotVerified = (props) => {
  const { t } = useTranslation(["common", "EmailNotVerified"]);
  const userData = useSelector((state) => {
    return state.user;
  });

  const [emailSentAgain, setEmailSentAgain] = useState(false);
  const [emailSentAgainSuccesfull, setEmailSentAgainSuccesfull] =
    useState(false);
  // const dispatch = useDispatch();
  // const logoutMethod = () => {
  //   // Updates state
  //   dispatch(authenticationAction.logout());
  //   // Removes token
  //   logout();
  //   navigate("/");
  // };
  const clickResendVerificationMail = async () => {
    try {
      await authenticationServive.resendEmailVerification(userData.email);
      setEmailSentAgain(true);
      setEmailSentAgainSuccesfull(true);
    } catch (err) {
      setEmailSentAgain(true);
      setEmailSentAgainSuccesfull(false);
    }
  };
  return (
    <>
      <Container maxWidth="sm">
        {!userData.emailVerified && (
          <div>
            <h2>{t("EmailNotVerified:heading")}</h2>
            <p>
              {t("EmailNotVerified:text1")} <b>{userData.email}</b>
              {t("EmailNotVerified:text2")}
            </p>
            <p>{t("EmailNotVerified:text3")}</p>
            {!emailSentAgain && (
              <Button variant="contained" onClick={clickResendVerificationMail}>
                {t("EmailNotVerified:buttonText")}
              </Button>
            )}
            {emailSentAgain && (
              <div>
                {emailSentAgainSuccesfull && (
                  <Alert severity="success">
                    {t("EmailNotVerified:successMsg")}
                  </Alert>
                )}
                {!emailSentAgainSuccesfull && (
                  <Alert severity="error">
                    {t("EmailNotVerified:failMsg")}
                  </Alert>
                )}
                <p>
                  {t("EmailNotVerified:text4")}{" "}
                  <Link href="/support" variant="body">
                    {t("EmailNotVerified:linkText")}
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  );
};

export default EmailNotVerified;
