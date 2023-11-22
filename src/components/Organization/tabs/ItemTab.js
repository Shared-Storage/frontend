import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import * as storageService from "./../../../services/storage";
import ItemCard from "./ItemCard";
import CreateItemDialog from "./CreateItemDialog";
import Alert from "./../../Alert";

const ItemTab = (props) => {

    const params = useParams();

  const [locations, setLocations]=useState([])
  const [openCreateDialog, setOpenCreateDialog]=useState(false)
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  const setAlertOpen = () => {
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    }, 3000);
  };

  const getLocations = async () => {
    const locationsList = await storageService.getItemsByOrganization({
      organizationId: params?.organizationId,
    });
    setLocations(locationsList.data)
  };
  useEffect(() => {
    getLocations();
  },[]);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          setOpenCreateDialog(true);
        }}
      >
        <AddIcon />
        Create Item
      </Button>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          padding: "10px 15px",
        }}
      >
        {locations.map((location, index) => {
          return (
            <ItemCard key={index} location={location}></ItemCard>
          );
        })}
      </Box>

      <CreateItemDialog
        handleClose={() => {
          setOpenCreateDialog(false);
        }}
        open={openCreateDialog}
        // Alert methods
        openAlert={openAlert}
        setAlertSeverity={setAlertSeverity}
        setAlertOpen={setAlertOpen}
        setAlertMessage={setAlertMessage}
        refreshLocations={getLocations}
      />

      {/* Error, info, warning and success */}
      <Alert severity={alertSeverity} open={openAlert} message={alertMessage} />
    </>
  );
};

export default ItemTab;
