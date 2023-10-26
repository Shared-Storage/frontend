import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { CardActionArea } from "@mui/material";
import * as logger from "./../../utils/logger";
import { useSelector } from "react-redux";
import * as organizationServices from "./../../services/organization";

export default function OrganizationCard(props) {
  const userData = useSelector((state) => {
    return state.user;
  });
  const [memberStatus, setMemberStatus] = React.useState();
  React.useEffect(() => {
    logger.log("props.organization");
    logger.log(props?.organization);
    // set status
    if (userData.email) {
      setMemberStatus(
        props?.organization?.orgMembers.find(
          (org) => org.email === userData.email
        )?.status
      );
    }
  }, [userData.email, props?.organization?.orgMembers, props?.organization]);

  const acceptInvitationSubmit = () => {
    logger.log("Accept submit");
    organizationServices.acceptInvitationToOrganization({organizationId: props?.organization?._id});
  };
  const declineInvitationSubmit = () => {
    logger.log("Decline submit");
    organizationServices.declineInvitationToOrganization({organizationId: props?.organization?._id});
  };
  const cardSubmit = () => {
    logger.log("Card submit");
  };

  const content = (props) => (
    <>
      <CardMedia
        component="img"
        height="140"
        image={props?.organization?.img}
        alt="green iguana"
        align="left"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props?.organization?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props?.organization?.description}
        </Typography>
        {memberStatus === "declined" && (
          <span style={{ color: "red" }}>Invitation Declined</span>
        )}
      </CardContent>
      {!props?.owned && memberStatus === "pending" && (
        <>
          <span>Invited by {props?.organization?.owner?.email}:</span>
          <br />
          <CardActions>
            <Button
              size="small"
              color="success"
              onClick={acceptInvitationSubmit}
            >
              Accept
            </Button>
            <Button
              size="small"
              color="error"
              onClick={declineInvitationSubmit}
            >
              Decline
            </Button>
          </CardActions>
        </>
      )}
    </>
  );

  return (
    <Card sx={{ maxWidth: 345, margin: "25px auto" }} elevation={10}>
      <CardActionArea onClick={cardSubmit}>
        {(props?.owned || (!props?.owned && memberStatus !== "pending")) &&
          content(props)}
      </CardActionArea>
      {!props?.owned && memberStatus === "pending" && content(props)}
    </Card>
  );
}
