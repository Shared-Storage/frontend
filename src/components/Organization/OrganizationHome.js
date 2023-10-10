import * as React from "react";
import OrganizationCard from "./OrganizationCard";
import CreateOrganizationDialog from "./CreateOrganizationDialog";
import { Box } from "@mui/material";

import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Alert from "./../Alert";
import * as organizationService from "../../services/organization";
import * as logger from "../../utils/logger";

const OrganizationHome = () => {
  const [ownedOrganizations, setOwnedOrganizations] = React.useState([]);
  const [sharedOrganizations, setSharedOrganizations] = React.useState([]);

  const getUserOrganizations = async () => {
    const orgs = await organizationService.getUserOrganizations();
    setOwnedOrganizations(orgs.data.ownedOrganizations);
    setSharedOrganizations(orgs.data.sharedOrganizations);
  };
  React.useEffect(() => {
    getUserOrganizations();
  }, []);

  // Dialog Methods
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertSeverity, setAlertSeverity] = React.useState("");

  const setAlertOpen = () => {
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    }, 3000);
  };

  return (
    <>
      <h1>Organizations</h1>
      <div style={{ width: "100%", padding: "0px 35px" }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <AddIcon />
          Create Organization
        </Button>
      </div>
      {/* <hr /> */}
      <h2>Your organizations</h2>
      {ownedOrganizations.length === 0 && (
        <div style={{ marginTop: "150px" }}>
          You don't own an organization, you need to create one.
        </div>
      )}
      {ownedOrganizations.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            padding: "10px 15px",
          }}
        >
          {ownedOrganizations.map((org, index) => {
            return (
              <OrganizationCard
                key={index}
                title={org.title}
                description={org.description}
                img={org.img}
              />
            );
          })}
        </Box>
      )}
      {sharedOrganizations.length > 0 && <hr />}
      {sharedOrganizations.length > 0 && <h2>Shared organizations</h2>}
      {sharedOrganizations.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            padding: "10px 15px",
          }}
        >
          {sharedOrganizations.map((org, index) => {
            return (
              <OrganizationCard
                key={index}
                title={org.title}
                description={org.description}
                img={org.img}
              />
            );
          })}
        </Box>
      )}
      <CreateOrganizationDialog
        handleClose={handleCloseDialog}
        open={openDialog}
        // Alert methods
        openAlert={openAlert}
        setAlertSeverity={setAlertSeverity}
        setAlertOpen={setAlertOpen}
        setAlertMessage={setAlertMessage}
        refreshOrganizations={getUserOrganizations}
      />
      {/* Error, info, warning and success */}
      <Alert severity={alertSeverity} open={openAlert} message={alertMessage} />
    </>
  );
};
export default OrganizationHome;
