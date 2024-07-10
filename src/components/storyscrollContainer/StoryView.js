import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Modal } from "@mui/material";

import React from "react";

const StoryView = ({ handleCloseStoryView }) => {
  return (
    <Modal open onClose={handleCloseStoryView}>
      <Box>
        <IconButton
          sx={{ position: "absolute", right: "1%", top: "1%" }}
          onClick={handleCloseStoryView}
        >
          <CloseIcon></CloseIcon>
        </IconButton>
      </Box>
    </Modal>
  );
};

export default StoryView;
