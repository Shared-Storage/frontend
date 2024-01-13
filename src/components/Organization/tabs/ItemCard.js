import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

const ItemCard = (props) => {
  return (
    <Card
      sx={{ maxWidth: 345, margin: "25px auto", width: 300 }}
      elevation={10}
    >
      {/* <CardActionArea> */}
      <CardMedia
        component="img"
        height="140"
        image={
          props.item.imageUrl
            ? props.item.imageUrl
            : "/assets/images/location-default.jpeg"
        }
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.item.name}
        </Typography>
        <Typography gutterBottom variant="p" component="div" align="left">
          {props.item.description}
        </Typography>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip
            avatar={
              <Avatar alt="Natacha" src={props.item.location?.imageUrl} />
            }
            label={props.item.location?.name}
            variant="outlined"
            clickable
          />
          {props.item.tags.map((tag, index) => (
            <Chip
              label={tag}
              color="info"
              variant="outlined"
              key={index}
              clickable
            />
          ))}
        </Stack>
      </CardContent>
      {/* </CardActionArea> */}
    </Card>
  );
};

export default ItemCard;
