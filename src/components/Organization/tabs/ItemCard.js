import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
// import { CardActionArea } from "@mui/material";

const ItemCard = (props) => {
  return (
    <Card sx={{ maxWidth: 345, margin: "25px auto", width: 300 }} elevation={10}>
      {/* <CardActionArea> */}
        <CardMedia
          component="img"
          height="140"
          image={props.location.imageUrl ? props.location.imageUrl : "/assets/images/location-default.jpeg"}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.location.name}
          </Typography>
          <Typography gutterBottom variant="p" component="div" align="left">
            {props.location.description}
          </Typography>
        </CardContent>
      {/* </CardActionArea> */}
    </Card>
  );
};

export default ItemCard;
