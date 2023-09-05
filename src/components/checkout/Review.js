import * as React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useLocation } from "react-router-dom";
import * as logger from "./../../utils/logger";
import { getPlans } from "./../../services/payments";

// const products = [
//   {
//     name: "Basic",
//     desc: "Basic Subscription",
//     price: 19.99,
//   },
//   {
//     name: "Premium",
//     desc: "Premium Subscription",
//     price: 39.99,
//   },
// ];

export default function Review() {
  const { state } = useLocation();
  const { membershipPlan } = state;
  const [product, setProduct] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    if (products.length > 0)
      setProduct(products.find((product) => product.title === membershipPlan));
  }, [membershipPlan, products]);

  React.useEffect(() => {
    const getPlansMethod = async () => {
      try {
        const plans = await getPlans();
        logger.log("plans");
        logger.log(plans);
        setProducts(plans);
      } catch (err) {
        logger.error(err);
        // setAlertSeverity("error");
        // setAlertMessage(err.message);
        // openAlert();
      }
    };
    getPlansMethod();
  }, []);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        <ListItem key={product?.name} sx={{ py: 1, px: 0 }}>
          <ListItemText
            primary={product?.title}
            secondary={product?.subheader}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${product?.price}
          </Typography>
        </ListItem>
        <Typography
            component="li"
            variant="subtitle1"
            align="left"
            sx={{ fontWeight: 700 }}
          >Description</Typography>
        {product?.description.map((line) => (
          <Typography
            component="li"
            variant="subtitle1"
            align="left"
            key={line}
          >
            - {line}
          </Typography>
        ))}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="HST 13%" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${((parseFloat(product?.price) * 13) / 100).toFixed(2)}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            $
            {(
              (parseFloat(product?.price) * 13) / 100 +
              parseFloat(product?.price)
            ).toFixed(2)}
          </Typography>
        </ListItem>
      </List>
    </React.Fragment>
  );
}
