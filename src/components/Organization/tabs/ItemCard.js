import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useNavigate } from "react-router-dom";

const ItemCard = (props) => {
  const navigate = useNavigate();
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
            onClick={() => {
              navigate(`?locationId=${props.item.location?._id}`);
            }}
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
      <CardActions>
        <DeleteOutlinedIcon
          style={{ cursor: "pointer" }}
          color="secondary"
          onClick={() => props.handleDeletePressed(props?.item)}
        />
      </CardActions>
    </Card>
  );
};

export default ItemCard;
