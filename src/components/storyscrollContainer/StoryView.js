import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, LinearProgress, Modal } from "@mui/material";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import React, { useEffect, useState } from "react";
import AvtarUserwithName from "../avtarofuser/AvtarUserwithName";
import { useDispatch } from "react-redux";
import { getstorymedia, storyseen } from "../../redux/slices/UserActionSlice";

const StoryView = ({
  handleCloseStoryView,
  data,
  next,
  prev,
  isNext,
  isPrev,
  handleseen,
}) => {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMedia = async () => {
      const res = await dispatch(
        getstorymedia({
          userId: data.userId,
          storyName: data.storyName,
        })
      );
      if (res.meta.requestStatus === "fulfilled") {
        setFile(
          "data:" +
            res.payload.data.fileType +
            ";base64, " +
            res.payload.data.imageBase64
        );
        const formdata = new FormData();
        formdata.append("storyId", data.storyId);
        handleseen();
        dispatch(storyseen(formdata));

        const timer = setInterval(() => {
          setProgress((oldProgress) => {
            if (oldProgress === 100) {
              clearInterval(timer);
              if (isNext) {
                next();
              } else {
                handleCloseStoryView();
              }
              return 0;
            }
            return Math.min(oldProgress + 100 / 150, 100);
          });
        }, 100);
      }
    };

    fetchMedia();
  }, [
    data.storyId,
    data.storyName,
    data.userId,
    dispatch,
    handleCloseStoryView,
    isNext,
    next,
  ]);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((oldProgress) => {
  //       if (oldProgress === 100) {
  //         clearInterval(timer);
  //         if (isNext) {
  //           next();
  //         } else {
  //           handleCloseStoryView();
  //         }
  //         return 0;
  //       }
  //       return Math.min(oldProgress + 100 / 150, 100);
  //     });
  //   }, 100);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [data, isNext, next, handleCloseStoryView]);

  return (
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
          className="absolute text-white  backdrop-brightness-50  rounded-2xl  w-full px-3 pt-3 shadow-lg"
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
          <LinearProgress variant="determinate" value={progress} />
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
  );
};

export default StoryView;
