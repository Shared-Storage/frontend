import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSearchParams } from "react-router-dom";
import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Paper,
  IconButton,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import * as logger from "./../../../utils/logger";
import * as storageService from "./../../../services/storage";
import ItemCard from "./ItemCard";
import CreateItemDialog from "./CreateItemDialog";
import Alert from "./../../Alert";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const ItemTab = (_props) => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const locationId = searchParams.get("locationId");

  const [items, setItems] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [deleteObject, setDeleteObject] = useState({
    item: undefined,
    open: false,
  });
  const [locations, setLocations] = useState([]);

  const getLocations = useCallback(async () => {
    const locationsList = await storageService.getLocationsByOrganization({
      organizationId: params?.organizationId,
    });
    setLocations(locationsList?.data?.locations);
  }, [params?.organizationId]);

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

  const [searchInput, setSearchInput] = useState("");
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };
  const handleSearchSubmit = async () => {
    if (locationId) {
      try {
        const itemsList =
          await storageService.searchItemByOrganizationbyLocation({
            organizationId: params?.organizationId,
            locationId,
            searchInput,
          });
        setItems(itemsList?.data?.items);
      } catch (error) {
        logger.error(error);
        setAlertMessage("Error: Couldn't search");
        setAlertSeverity("error");
        setAlertOpen();
      }
    } else {
      try {
        const itemsList = await storageService.searchItemByOrganization({
          organizationId: params?.organizationId,
          searchInput,
        });
        setItems(itemsList?.data?.items);
      } catch (error) {
        logger.error(error);
        setAlertMessage("Error: Couldn't search");
        setAlertSeverity("error");
        setAlertOpen();
      }
    }
  };

  const handleSearchClear = async () => {
    setSearchInput("");
    await getItems();
  };

  const setAlertOpen = () => {
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
    }, 3000);
  };

  const getItems = useCallback(async () => {
    if (locationId && locationId !== "") {
      if (searchInput) {
        console.log("FLAG1");
        // Get items if you have search input and location
        try {
          const itemsList =
            await storageService.searchItemByOrganizationbyLocation({
              organizationId: params?.organizationId,
              locationId,
              searchInput,
            });
          setItems(itemsList?.data?.items);
        } catch (error) {
          logger.error("Error flag 2");
        }
      } else {
        console.log("FLAG2");
        // Get items if you have location only
        try {
          const itemsList =
            await storageService.getItemsByOrganizationByLocation({
              organizationId: params?.organizationId,
              locationId,
            });
          setItems(itemsList?.data?.items);
        } catch (error) {
          logger.error("Error flag 2");
        }
      }
    } else {
      if (searchInput) {
        console.log("FLAG3");
        // Get items if you have search input only
        try {
          const itemsList = await storageService.searchItemByOrganization({
            organizationId: params?.organizationId,
            searchInput,
          });
          setItems(itemsList?.data?.items);
        } catch (error) {
          logger.error("Error flag 2");
        }
      } else {
        console.log("FLAG4");
        // Get all items
        try {
          const itemsList = await storageService.getItemsByOrganization({
            organizationId: params?.organizationId,
          });
          setItems(itemsList?.data?.items);
        } catch (error) {
          logger.error("Error flag 3");
        }
      }
    }
  }, [params?.organizationId, locationId, searchInput]);
  useEffect(() => {
    getItems();
    getLocations();
  }, [getItems, getLocations]);

  const handleLocationChange = (data) => {
    if (data?.target?.value !== "")
      navigate(`?locationId=${data?.target?.value}`);
    else {
      navigate(``);
    }
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        {/* Add icon */}
        <Button
          variant="contained"
          onClick={() => {
            setOpenCreateDialog(true);
          }}
          style={{ margin: "0 5px" }}
        >
          <AddIcon />
          Create Item
        </Button>
        {/* Search bar  */}
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
            margin: "0 5px",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Items"
            inputProps={{ "aria-label": "search items" }}
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            color="secondary"
            onClick={handleSearchClear}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={handleSearchSubmit}
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        {/* Dropdown */}
        <div style={{ margin: "0 5px" }}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Location</InputLabel>
            <Select
              id="demo-simple-select"
              labelId="demo-simple-select-label"
              label="Location"
              style={{ width: 150 }}
              value={locationId ? locationId : ""}
              onChange={handleLocationChange}
            >
              <MenuItem
                value={""}
                onClick={async () => {
                  await getItems();
                }}
              >
                Clear selection
              </MenuItem>
              {locations.map((location) => (
                <MenuItem key={location._id} value={location?._id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
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
