import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

import * as storageService from "./../../../services/storage";
import LocationCard from "./LocationCard";

const LocationTab = (props) => {
  const params = useParams();

  const [locations, setLocations]=useState([])

  useEffect(() => {
    const getLocations = async () => {
      const locationsList = await storageService.getLocationsByOrganization({
        organizationId: params?.organizationId,
      });
      setLocations(locationsList.data)
    };
    getLocations();
  }, [params?.organizationId]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          padding: "10px 15px",
        }}
      >
        {locations.map((location, index) => {
            return (
        <LocationCard index={index} location={location}></LocationCard>)})}
      </Box>
    </>
  );
};

export default LocationTab;
