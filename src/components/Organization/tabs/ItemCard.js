import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
// import { CardActionArea } from "@mui/material";

const ItemCard = (props) => {
  return (
    <Card sx={{ maxWidth: 345, margin: "25px auto" }} elevation={10}>
      {/* <CardActionArea> */}
        <CardMedia
          component="img"
          height="140"
          image={props.location.img ? props.location.img : "/assets/images/location-default.jpeg"}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {props.location.name}
          </Typography>
        </CardContent>
      {/* </CardActionArea> */}
    </Card>
  );
};

export default ItemCard;
