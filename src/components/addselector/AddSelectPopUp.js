import React, { useEffect, useState } from "react";
import GridOnIcon from "@mui/icons-material/GridOn";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import HistoryToggleOffTwoToneIcon from "@mui/icons-material/HistoryToggleOffTwoTone";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { assets } from "../../constants/Assets";
import { Stack } from "@mui/material";
import { useFilePicker } from "use-file-picker";
import CaptionAndConfirm from "./CaptionAndConfirm";
import {
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";
import { ToastContainer, toast } from "react-toastify";
const AddSelectPopUp = () => {
  const [postData, setPostData] = useState({ PostType: null, Files: null });
  const [multiple, setMultiple] = useState(true);
  const [triggerPicker, setTriggerPicker] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const { openFilePicker, loading, errors } = useFilePicker({
    multiple: multiple,
    readAs: "DataURL",
    accept: ["image/*", "video/*"],
    onFilesSelected: ({ filesContent }) => {
      setPostData((prevState) => ({
        ...prevState,
        Files: filesContent,
      }));
    },
    validators: [
      new FileSizeValidator({ maxFileSize: 1 * 1024 * 1024 }),
      new FileTypeValidator([
        "jpg",
        "jpeg",
        "png",
        // "gif",
        // "bmp",
        // "webp",
        "mp4",
        // "mov",
        // "avi",
        // "mkv",
        // "wmv",
        // "mp3",
        // "wav",
        // "ogg",
      ]),
    ],
  });

  function handlePostClick(value) {
    setMultiple(value === "Post");
    setPostData({ PostType: value, Files: null });
    setIsSelected(false);
    setTriggerPicker(true);
  }

  useEffect(() => {
    if (triggerPicker) {
      openFilePicker();
      setTriggerPicker(false);
    }
  }, [triggerPicker, multiple, openFilePicker]);

  useEffect(() => {
    if (postData.Files) {
      setIsSelected(true);
    }
  }, [postData]);

  useEffect(() => {
    if (errors.length) {
      toast.error(errors[0].reason);
    }
  }, [errors]);

  return (
    <div>
      <ToastContainer></ToastContainer>
      <PopupState variant="popover" popupId="add">
        {(popupState) => (
          <React.Fragment>
            <div
              role="button"
              className={`flex gap-2 items-center`}
              {...bindTrigger(popupState)}
            >
              <img src={assets.addIcon} width={"28px"} alt="" />
              <span className="md:hidden">Add</span>
            </div>
            <Menu {...bindMenu(popupState)}>
              <MenuItem
                onClick={() => {
                  handlePostClick("Post");
                  popupState.close();
                }}
              >
                <Stack spacing={1} direction={"row"} alignItems={"center"}>
                  <GridOnIcon /> <span>Post</span>
                </Stack>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handlePostClick("Story");
                  popupState.close();
                }}
              >
                {" "}
                <Stack spacing={1} direction={"row"} alignItems={"center"}>
                  <HistoryToggleOffTwoToneIcon /> <span>Story</span>
                </Stack>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handlePostClick("Reel");
                  popupState.close();
                }}
              >
                {" "}
                <Stack spacing={1} direction={"row"} alignItems={"center"}>
                  <MovieFilterIcon /> <span>Reel</span>
                </Stack>
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
      {isSelected && <CaptionAndConfirm data={postData} />}
    </div>
  );
};

export default AddSelectPopUp;
