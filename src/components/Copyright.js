import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function Copyright(props) {
  const { t } = useTranslation(["common"]);
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {t("copyright")}{" © "}
      breadbutter.dev {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default Copyright;
