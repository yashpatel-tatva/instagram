import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, LinearProgress } from "@mui/material";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import React, { useEffect, useState, forwardRef, useRef } from "react";
import AvtarUserwithName from "../avtarofuser/AvtarUserwithName";
import { useDispatch } from "react-redux";
import {
  deletestory,
  getstorymedia,
  personalstorylist,
  storyseen,
  useSelectorUserAction,
} from "../../redux/slices/UserActionSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useTimer } from "react-timer-hook";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ReactPlayer from "react-player";

const StoryView = forwardRef(
  (
    { handleCloseStoryView, data, next, prev, isNext, isPrev, handleseen },
    ref
  ) => {
    const { user } = useSelectorUserAction();
    const [file, setFile] = useState();
    const [isPaused, setIsPaused] = useState(false);
    const dispatch = useDispatch();

    async function deleteStory(storyId) {
      await dispatch(deletestory(storyId));
      handleCloseStoryView();
      await dispatch(personalstorylist());
    }

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
          dispatch(storyseen(formdata));

          restartTimer();
        }
      };

      fetchMedia();
    }, [
      data.storyId,
      data.storyName,
      data.userId,
      dispatch,
      handleseen,
      isNext,
      next,
    ]);

    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 15); // 15 seconds timer

    const { seconds, isRunning, pause, resume, restart } = useTimer({
      expiryTimestamp,
      onExpire: () => {
        if (isNext) {
          next();
        } else {
          handleCloseStoryView();
        }
      },
    });

    const restartTimer = () => {
      const newExpiryTimestamp = new Date();
      newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + 15);
      restart(newExpiryTimestamp);
    };

    const modalRef = useRef(null);
    useEffect(() => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }, []);

    const [openViewList, setOpenViewList] = useState(false);

    function handleOpenViewList(storyId) {
      setOpenViewList(!openViewList);
      if (isRunning) {
        pause();
        setIsPaused(true);
      }
    }

    function pauseResumeStory() {
      if (isRunning) {
        console.log(isRunning, isPaused);
        pause();
        setIsPaused(true);
      } else {
        resume();
        setIsPaused(false);
      }
    }
    const videoEl = useRef(null);

    const video = videoEl.current;

    useEffect(() => {
      if (data.storyType === "Video") {
        if (video) {
          if (isPaused) {
            video.pause();
          } else {
            video.play();
          }
        }
      }
    }, [isPaused]);

    return (
      <Box
        ref={modalRef}
        sx={{ height: "100%" }}
        className="flex justify-center items-center"
      >
        <div className="absolute z-10 right-4 top-4 fm:hidden">
          <IconButton
            sx={{
              backgroundColor: "white",
              "&:hover": { backgroundColor: "pink" },
            }}
            onClick={handleCloseStoryView}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className="bg-white h-3/4 w-1/4 xl:w-1/3 md:w-1/2 relative rounded-2xl sm:w-3/4 fm:w-screen fm:h-screen">
          <div
            className="absolute text-white backdrop-brightness-75 rounded-2xl w-full px-3 pt-3 shadow-lg"
            style={{ zIndex: "1" }}
          >
            <div className="mb-4 flex justify-between items-center">
              <AvtarUserwithName
                data={{
                  userName: data.userName,
                  userId: data.userId,
                  profilePictureName: data.profilePictureName,
                }}
                story={false}
                comment={data.caption ?? " "}
              />
              <div className="flex">
                {data.userId === user.userId && (
                  <>
                    <div className="">
                      <IconButton
                        aria-label="storyView"
                        size="large"
                        onClick={() => handleOpenViewList(data.storyId)}
                      >
                        {openViewList ? (
                          <VisibilityOffIcon sx={{ color: "white" }} />
                        ) : (
                          <VisibilityIcon sx={{ color: "white" }} />
                        )}
                      </IconButton>
                    </div>
                    <div className="fm:hidden">
                      <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => deleteStory(data.storyId)}
                      >
                        <DeleteIcon sx={{ color: "white" }} />
                      </IconButton>
                    </div>
                  </>
                )}
                <div className="fnm:hidden">
                  <IconButton
                    size="large"
                    sx={{
                      color: "white",
                      "&:hover": { color: "white" },
                    }}
                    onClick={handleCloseStoryView}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            </div>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              {Array.from({ length: data.outOf }).map((_, i) => (
                <LinearProgress
                  key={i}
                  variant="determinate"
                  value={
                    i === data.index - 1
                      ? 100 - (seconds / 15) * 100
                      : i < data.index - 1
                      ? 100
                      : 0
                  }
                  sx={{
                    flex: 1,
                    height: "4px",
                    borderRadius: "2px",
                    backgroundColor: "grey.300",
                  }}
                />
              ))}
            </Box>
          </div>
          <div className="absolute  h-full w-full top-0 z-0">
            <div
              className={`${
                openViewList ? "h-1/3" : "h-full w-full"
              }  flex justify-center items-center transition-all relative`}
            >
              {data.storyType === "Image" && (
                <img
                  src={file}
                  className={`${
                    openViewList ? "w-auto" : " w-full"
                  } rounded-2xl max-h-full transition-all`}
                  alt={data.caption}
                  onClick={pauseResumeStory}
                />
              )}
              {data.storyType === "Video" && (
                <div
                  onClick={pauseResumeStory}
                  className="h-full w-full flex justify-center items-center"
                >
                  <video
                    poster={file}
                    src={file}
                    autoPlay
                    ref={videoEl}
                    loop
                    className={`${
                      openViewList ? "w-auto" : " w-full"
                    } rounded-2xl max-h-full transition-all`}
                    alt={data.caption}
                    onClick={pauseResumeStory}
                  />
                  {/* <ReactPlayer
                    url={file}
                    loop
                    playing={!isPaused}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "1rem",
                      maxHeight: "100%",
                      transition: "all 0.2s",
                    }}
                    alt={data.caption}
                  /> */}
                </div>
              )}
              {isPaused && (
                <IconButton
                  onClick={pauseResumeStory}
                  sx={{
                    position: "absolute",
                    zIndex: "4",
                    top: "50%",
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "pink" },
                  }}
                  size="large"
                >
                  <PlayArrowRoundedIcon />
                </IconButton>
              )}
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
            </div>
            {data.userId === user.userId && (
              <div
                className={`${
                  openViewList ? "block" : "hidden"
                } h-2/3 bg-white flex flex-col  border-2 border-t rounded-t-lg rounded-r-lg absolute commentbox overflow-scroll`}
              >
                <div className="p-2 px-4 border-b-2 border-t-2 flex items-center justify-between w-full">
                  <span>
                    <VisibilityIcon /> {data.storyViewList.length}
                  </span>
                  <div className="fnm:hidden">
                    <IconButton
                      aria-label="delete"
                      size="large"
                      onClick={() => {
                        deleteStory(data.storyId);
                      }}
                    >
                      <DeleteIcon sx={{ color: "black" }} />
                    </IconButton>
                  </div>
                </div>
                {data.storyViewList &&
                  data.storyViewList.length > 0 &&
                  data.storyViewList.map((element, index) => {
                    return (
                      <div key={index}>
                        <AvtarUserwithName data={element}></AvtarUserwithName>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </Box>
    );
  }
);

export default StoryView;
