import {
  Backdrop,
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useRef, useState } from "react";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  addstory,
  createpost,
  useSelectorUserAction,
} from "../../redux/slices/UserActionSlice";
import Avatar from "@mui/material/Avatar";
import PlaceIcon from "@mui/icons-material/Place";
import "./CaptionAndConfirm.css";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { AllRoutes } from "../../constants/AllRoutes";

const CaptionAndConfirm = (data) => {
  const { user, loading, userPhoto } = useSelectorUserAction();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const [index, setIndex] = useState(0);

  function handlePrev() {
    if (index !== 0) {
      setIndex((n) => n - 1);
    }
  }
  function handleNext() {
    if (index !== data.data.Files.length - 1) {
      setIndex((n) => n + 1);
    }
  }

  const caption = useRef();
  const location = useRef();
  const navigate = useNavigate();
  async function handleShare() {
    const formData = new FormData();
    formData.append("Caption", caption.current.value);
    if (data.data.PostType !== "Story") {
      data.data.Files.forEach((file, index) => {
        const blob = dataURItoBlob(file.content);
        formData.append("File", blob, file.name);
      });
      formData.append("Location", location.current.value);
      formData.append("PostType", data.data.PostType);
      const res = await dispatch(createpost(formData));
      if (res.payload.isSuccess) {
        handleClose();
        navigate(AllRoutes.UserProfile, { replace: true });
      }
    } else {
      data.data.Files.forEach((file, index) => {
        const blob = dataURItoBlob(file.content);
        formData.append("Story", blob, file.name);
      });
      const res = await dispatch(addstory(formData));
      if (res.payload.isSuccess) {
        handleClose();
      }
    }
  }

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
  return (
    <Backdrop open={open} sx={{ zIndex: "9" }}>
      <div className="relative w-full h-2/3 fm:h-full bg-white z-10">
        <div
          className="w-full flex items-center p-2 px-4 justify-between bg-gray-600 text-white"
          style={{ height: "8%" }}
        >
          <button onClick={handleClose} style={{ color: "white" }}>
            <CloseSharpIcon />
          </button>
          <span>Add new {data.data.PostType}</span>
          <div>
            <LoadingButton
              loading={loading}
              className=" px-4 py-1 rounded-full"
              onClick={handleShare}
            >
              Share
            </LoadingButton>
          </div>
        </div>
        <div className="fnm:flex" style={{ height: "92%" }}>
          <div className="w-1/2 fm:w-full border-r-2 fm:border-b-2 h-full fm:h-1/2">
            <div className="w-full flex justify-center h-full">
              <div className="relative w-10/12">
                {data.data.Files.length !== 1 && (
                  <div className="absolute z-10 right-1 top-1">
                    <div className="bg-black p-1 text-white rounded-full z-10">
                      <span className="">
                        {index + 1}/{data.data.Files.length}
                      </span>
                    </div>
                  </div>
                )}
                <div className="absolute w-full h-full object-contain flex justify-center items-center z-0">
                  <video
                    poster={data.data.Files[index].content}
                    autoPlay
                    src={data.data.Files[index].content}
                    className="w-full max-h-full"
                    alt=""
                  ></video>
                </div>{" "}
                {index !== 0 && (
                  <div className="absolute top-1/2 left-1 z-10  opacity-20 hover:opacity-100">
                    <Box
                      sx={{ backgroundColor: "white" }}
                      className="rounded-full"
                      onClick={handlePrev}
                    >
                      <ChevronLeftIcon></ChevronLeftIcon>
                    </Box>
                  </div>
                )}
                {index !== data.data.Files.length - 1 && (
                  <div className="absolute top-1/2 right-1 z-10 opacity-20 hover:opacity-100">
                    <Box
                      sx={{ backgroundColor: "white" }}
                      className="rounded-full"
                      onClick={handleNext}
                    >
                      <ChevronRightIcon></ChevronRightIcon>
                    </Box>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-1/2 fm:w-full  h-full fm:h-1/2 p-4">
            <div className="flex gap-4 items-center">
              <Avatar alt="profile" src={userPhoto} />{" "}
              <span className="font-semibold">{user.userName}</span>
            </div>
            <div className="w-10/12 py-6">
              <TextField
                inputRef={caption}
                fullWidth
                placeholder="Write Caption"
                multiline
                rows={6}
                variant="standard"
              />
            </div>
            {data.data.PostType !== "Story" && (
              <div className="w-10/12 py-6">
                <TextField
                  inputRef={location}
                  fullWidth
                  placeholder="Add Location"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaceIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

export default CaptionAndConfirm;
