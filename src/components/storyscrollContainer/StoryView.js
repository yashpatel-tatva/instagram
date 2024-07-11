import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Modal } from "@mui/material";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import React, { useEffect, useState } from "react";
import AvtarUserwithName from "../avtarofuser/AvtarUserwithName";
import { useDispatch } from "react-redux";
import { getstorymedia } from "../../redux/slices/UserActionSlice";
import zIndex from "@mui/material/styles/zIndex";

const StoryView = ({
  handleCloseStoryView,
  data,
  next,
  prev,
  isNext,
  isPrev,
}) => {
  const [file, setfile] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      const res = await dispatch(
        getstorymedia({
          userId: data.userId,
          storyName: data.storyName,
        })
      );
      setfile(
        "data:" +
          res.payload.data.fileType +
          ";base64, " +
          res.payload.data.imageBase64
      );
    };
    fetch();
  }, [data.storyName, data.userId, dispatch]);

  return (
    <Modal open onClose={handleCloseStoryView}>
      <Box sx={{ height: "100%" }} className="flex justify-center items-center">
        <IconButton
          sx={{
            position: "absolute",
            zIndex: "4",
            right: "1%",
            top: "1%",
            backgroundColor: "white",
            "&:hover": { backgroundColor: "pink" },
          }}
          onClick={handleCloseStoryView}
        >
          <CloseIcon></CloseIcon>
        </IconButton>
        {isNext && (
          <IconButton
            sx={{
              position: "absolute",
              zIndex: "4",
              right: "1%",
              top: "50%",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "lightcoral" },
            }}
            onClick={next}
          >
            <ChevronRightOutlinedIcon />
          </IconButton>
        )}
        {isPrev && (
          <IconButton
            sx={{
              position: "absolute",
              zIndex: "4",
              left: "1%",
              top: "50%",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "lightcoral" },
            }}
            onClick={prev}
          >
            <ChevronLeftOutlinedIcon />
          </IconButton>
        )}

        <div className="bg-white h-3/4 w-1/4 xl:w-1/3  md:w-1/2 relative  rounded-2xl sm:w-3/4 fm:w-screen fm:h-screen">
          <div
            className="absolute text-white  backdrop-brightness-50  rounded-2xl  w-full p-3 shadow-lg"
            style={{ zIndex: "1" }}
          >
            <div>
              <AvtarUserwithName
                data={{
                  userName: data.userName,
                  userId: data.userId,
                  profilePictureName: data.profilePictureName,
                }}
                comment={data.caption ?? " "}
              ></AvtarUserwithName>
            </div>
          </div>
          <div className="absolute h-full w-full top-0 z-0">
            {data.storyType === "Image" && (
              <div className="h-full w-full flex justify-center items-center ">
                <img
                  src={file}
                  className="w-full  rounded-2xl max-h-full"
                  alt={data.caption}
                ></img>
              </div>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default StoryView;
