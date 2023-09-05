import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const { t } = useTranslation(["common", "PageNotFound"]);
  return (
    <>
      <h1>{t("PageNotFound:title")}</h1>
    </>
  );
};

export default PageNotFound;
