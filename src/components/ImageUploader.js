import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import * as logger from "../utils/logger";

const ImageUploader = (props) => {
  const imageChanged = async (event) => {
    console.log("Image changed");
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    // Upload Image to S3
    try {
      const response = await props.uploadImage(formData);
      const imageUrl = response.data.data.fileLocation;
      props.handleUploadedImageUrl(imageUrl);
      // Success message
    } catch (err) {
      logger.log("err");
      logger.log(err);
      // Error message
    }
  };
  return (
    <>
      <Button variant="contained" color="secondary" component="label">
        {props.buttonText}
        <EditIcon sx={{ width: 17 }} />
        <input hidden type="file" onChange={imageChanged} />
      </Button>
    </>
  );
};

export default ImageUploader;
