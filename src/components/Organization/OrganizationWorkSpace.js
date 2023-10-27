import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper, Container } from "@mui/material";
import OrganizationBasicTabs from "./OrganizationBasicTabs";
import { useParams } from "react-router-dom";
import * as organizationService from "./../../services/organization";
import * as logger from "./../../utils/logger";
import { organizationAction } from "../../store/organization";

const OrganizationWorkSpace = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const organizationState = useSelector((state) => {
    return state.organization;
  });

  const [organizationId, setOrganizationId] = React.useState(undefined);

  React.useEffect(() => {
    setOrganizationId(params?.organizationId);
  }, [params?.organizationId]);

  React.useEffect(() => {
    const getOrganization = async (organizationId) => {
      const response = await organizationService.getOrganizationFromId(
        organizationId
      );
      // Set organization state
      logger.log("Set organization state");
      dispatch(
        organizationAction.setOrganizationState(response?.data?.organization)
      );
    };
    if (organizationId) {
      getOrganization(organizationId);
    }
  }, [organizationId, dispatch]);

  return (
    <>
      <Paper variant="outlined">
        <Container component="main">
          {/* <h1>WorkSpace</h1> */}
          <h3>{organizationState.title} organization</h3>
          <p>{organizationState?.description}</p>

          <OrganizationBasicTabs />
        </Container>
      </Paper>
    </>
  );
};
export default OrganizationWorkSpace;
