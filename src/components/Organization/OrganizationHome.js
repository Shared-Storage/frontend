import * as React from "react";
import OrganizationCard from "./OrganizationCard";
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import * as logger from "./../../utils/logger";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';

const OrganizationHome = () => {
  // const organizations=[]
  const organizations = [
    {
      title: "Organization 1",
      description: "Organization 1 description.",
      img: "assets/images/organization_defaults/1.jpg",
    },
    {
      title: "Organization 2",
      description: "Organization 2 description.",
      img: "assets/images/organization_defaults/2.jpg",
    },
    {
      title: "Organization 3",
      description: "Organization 3 description.",
      img: "assets/images/organization_defaults/3.jpg",
    },
    {
      title: "Organization 4",
      description: "Organization 4 description.",
      img: "assets/images/organization_defaults/4.jpg",
    },
    {
      title: "Organization 5",
      description: "Organization 5 description.",
      img: "assets/images/organization_defaults/5.jpg",
    },
    {
      title: "Organization 6",
      description: "Organization 6 description.",
      img: "assets/images/organization_defaults/6.jpg",
    },
    {
      title: "Organization 7",
      description: "Organization 7 description.",
      img: "assets/images/organization_defaults/7.jpg",
    },
  ];
  const actions = [
    { icon: <FileCopyIcon />, name: "Copy" },
    { icon: <SaveIcon />, name: "Save" },
    { icon: <PrintIcon />, name: "Print" },
    { icon: <ShareIcon />, name: "Share" },
  ];
  return (
    <>
      <h1>Organizations</h1>
      <div style={{width: "100%", padding: "0px 35px"}}>
        <Button variant="contained"><AddIcon />Create Organization</Button>
      </div>
      {/* <hr /> */}
      {organizations.length === 0 && (
        <div style={{marginTop: "150px"}}>No organization exists, you need to create one.</div>
      )}
      {organizations.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            padding: "10px 15px",
          }}
        >
          {organizations.map((org, index) => {
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
    </>
  );
};
export default OrganizationHome;
