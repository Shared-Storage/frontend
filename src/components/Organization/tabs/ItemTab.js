import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import * as storageService from "./../../../services/storage";
import ItemCard from "./ItemCard";
import CreateItemDialog from "./CreateItemDialog";
import Alert from "./../../Alert";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const ItemTab = (_props) => {
  const params = useParams();

  const [items, setItems] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [deleteObject, setDeleteObject] = useState({
    item: undefined,
    open: false,
  });

  const handleDeletePressed = (itemToBeDeleted) => {
    setDeleteObject({ item: itemToBeDeleted, open: true });
  };
  const closeDeleteDialog = () => {
    setDeleteObject({ item: undefined, open: false });
  };
  const handleConfirmDelete = async () => {
    try {
      await storageService.deleteItem(deleteObject.item);
      closeDeleteDialog();
      getItems(); // Refresh items
      // Alert
      setAlertMessage("Item deleted");
      setAlertSeverity("success");
      setAlertOpen();
    } catch (error) {
      setAlertMessage("Error: Item not deleted");
      setAlertSeverity("error");
      setAlertOpen();
      closeDeleteDialog();
    }
  };

  const setAlertOpen = () => {
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    }, 3000);
  };

  const getItems = useCallback(async () => {
    const itemsList = await storageService.getItemsByOrganization({
      organizationId: params?.organizationId,
    });
    setItems(itemsList?.data?.items);
  }, [params?.organizationId]);
  useEffect(() => {
    getItems();
  }, [getItems]);

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
        {items.map((item, index) => {
          return (
            <ItemCard
              key={index}
              item={item}
              handleDeletePressed={handleDeletePressed}
            ></ItemCard>
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
        refreshItems={getItems}
      />

      {/* Error, info, warning and success */}
      <Alert severity={alertSeverity} open={openAlert} message={alertMessage} />
      <DeleteConfirmationDialog
        name={deleteObject?.item?.name}
        open={deleteObject?.open}
        handleClose={closeDeleteDialog}
        handleConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};

export default ItemTab;
