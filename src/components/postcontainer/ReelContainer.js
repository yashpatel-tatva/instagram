import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../constants/Assets";
import "./PostContainer.css";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TextField,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EllipsisTextUptoTwo from "../ellipsisTextTwoline/EllipsisTextUptoTwo";
import {
  commentonpost,
  deletecommentonpost,
  deletepost,
  getmediafromname,
  getotheruserdata,
  getpostbyid,
  getpostfollowerfollowingcount,
  likeunlikepost,
  useSelectorUserAction,
} from "../../redux/slices/UserActionSlice";
import { useDispatch } from "react-redux";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import AvtarUserwithName from "../avtarofuser/AvtarUserwithName";
import AvatarGroup from "@mui/material/AvatarGroup";
import AvtarGroupthree from "../avtarofuser/AvtarGroupthree";
import AvtarUserwithFollowbtn from "../avtarofuser/AvtarUserwithFollowbtn";

const ReelContainer = ({ postdata, postUserName }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(postdata);
  const { user, updaterender } = useSelectorUserAction();
  const [mediaName, setMediaName] = useState();
  const [imgList, setImgList] = useState();

  const [loader, setLoader] = useState(true);

  const [isLike, setIsLike] = useState(
    !!data.postLikes.find((element) => element.userId === user.userId)
  );
  const [likeCount, setLikeCount] = useState(data.postLikes.length);

  useEffect(() => {
    setIsLike(
      !!data.postLikes.find((element) => element.userId === user.userId)
    );
  }, [data, user.userId]);

  useEffect(() => {
    let medialist = [];
    data.medias.map((media) =>
      medialist.push({
        userId: data.userId,
        postName: media.mediaName,
        postType: data.postType,
        mediaType: media.mediaType,
      })
    );
    setMediaName(medialist);
  }, []);

  useEffect(() => {
    if (mediaName) {
      const fetchAllImages = async () => {
        setImgList([]);
        const fetchPromises = mediaName.map(async (element) => {
          const payload = {
            data: element,
            type: element.postType,
          };
          const res = await dispatch(getmediafromname(payload));
          if (res.meta.requestStatus === "fulfilled") {
            const img = {
              src:
                "data:" +
                res.payload.data.fileType +
                ";base64, " +
                res.payload.data.imageBase64,
              count: element.count,
              postId: element.postId,
            };
            return img;
          }
        });

        const imgList = await Promise.all(fetchPromises);
        setImgList(imgList);
        setLoader(false);
      };

      fetchAllImages();
    }
  }, [mediaName]);

  //   useEffect(() => {
  //     console.log(imgList);
  //   }, [imgList]);

  const [index, setIndex] = useState(0);

  function handlePrev() {
    if (index !== 0) {
      setIndex((n) => n - 1);
    }
  }
  function handleNext() {
    if (index !== imgList.length - 1) {
      setIndex((n) => n + 1);
    }
  }

  const [isDeleted, setIsDeleted] = useState(false);

  async function handleDeletePost() {
    setIsDeleted(true);
    await dispatch(deletepost(data.postId));
    dispatch(getpostfollowerfollowingcount(data.userId));
  }

  async function handleLike() {
    // !isLike ? setLikeCount((n) => n + 1) : setLikeCount((n) => n - 1);
    // setIsLike(!isLike);
    const payload = {
      userId: user.userId,
      postId: data.postId,
      isLike: !isLike,
    };
    await dispatch(likeunlikepost(payload));
    await renderPost();
  }
  const commentBox = useRef();

  const [dynamicInputProps, setDynamicInputProps] = useState({});

  function handleCommentChange() {
    if (
      commentBox.current.value === null ||
      commentBox.current.value.trim() === ""
    ) {
      setDynamicInputProps({});
    } else {
      setDynamicInputProps({
        InputProps: {
          endAdornment: (
            <IconButton
              position="end"
              className="text-sm"
              onClick={handleCommentSend}
            >
              <span className="text-blue-700 text-sm">Post</span>
            </IconButton>
          ),
        },
      });
    }
  }

  async function handleCommentSend() {
    if (
      commentBox.current.value !== null &&
      commentBox.current.value.trim() !== ""
    ) {
      const payload = {
        userId: user.userId,
        postId: data.postId,
        commentText: commentBox.current.value,
      };
      await dispatch(commentonpost(payload));
      commentBox.current.value = "";
      setDynamicInputProps({});
      await renderPost();
    }
  }

  async function renderPost() {
    const res = await dispatch(
      getpostbyid({ postType: data.postType, postId: data.postId })
    );
    setData(res.payload.data);
    setIsLike(
      !!res.payload.data.postLikes.find(
        (element) => element.userId === user.userId
      )
    );
    setLikeCount(res.payload.data.postLikes.length);
  }

  /// comments section

  const [openComment, setopenComment] = useState(false);

  function openCommentsection() {
    setopenComment(!openComment);
  }

  async function deleteCommment(commentId) {
    await dispatch(deletecommentonpost(commentId));
    await renderPost();
  }

  //like section

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    padding: "0px 5px 5px 5px",
  };

  const [openListModal, setOpenListModal] = React.useState(false);
  const [listShow, setListShow] = useState();
  const [listName, setListName] = useState();
  const handleListOpen = async (value) => {
    setListName(value);
    setListShow(data.postLikes);
    setOpenListModal(true);
  };
  const handleClose = () => setOpenListModal(false);

  const [postUserData, setPostUserData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const userdata = await dispatch(getotheruserdata(data.userId));
      setPostUserData(userdata.payload);
    };
    fetch();
  }, []);

  async function updatefollow() {
    const userdata = await dispatch(getotheruserdata(data.userId));
    setPostUserData(userdata.payload);
  }

  if (isDeleted) {
    return null; // Do not render if deleted
  }

  return (
    <div
      value={updaterender}
      className=" w-8/12 fnm:relative md:w-9/12 fm:w-full border-b-2"
    >
      <div className="relative flex justify-center">
        {imgList && imgList.length !== 0 && imgList.length !== 1 && (
          <div className="absolute z-10 right-1 top-1">
            <div className="bg-black p-1 text-white rounded-full z-10">
              <span className="">
                {index + 1}/{imgList.length}
              </span>
            </div>
          </div>
        )}
        {imgList && imgList.length !== 0 && index !== 0 && (
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
        {imgList && imgList.length !== 0 && index !== imgList.length - 1 && (
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

        <div
          className="flex justify-center relative "
          style={{
            width: "auto",
            maxHeight: "100vh",
            aspectRatio: "9/16",
          }}
        >
          <div className="absolute bottom-3 fm:bottom-11 left-1 z-20 w-11/12">
            <div className="w-full">
              <div
                role="button"
                className="flex gap-2 items-center py-2 text-white"
                style={{ width: "100%" }}
              >
                <AvtarUserwithFollowbtn
                  data={{
                    ...postUserData,
                    userName: data.userName,
                    userId: data.userId,
                    profilePictureName: data.profilePhotoName,
                  }}
                  followclass={{ border: "2px solid white", color: "white" }}
                  alt=""
                  setResult={updatefollow}
                />
              </div>
              <div>
                <span>{postUserName}</span>
                <EllipsisTextUptoTwo
                  color="white"
                  text={data.caption}
                ></EllipsisTextUptoTwo>
              </div>
              {likeCount !== 0 && (
                <div role="button" className="text-white">
                  <div
                    onClick={() => handleListOpen("Likes")}
                    className="flex gap-3 items-center"
                  >
                    <AvtarGroupthree data={data.postLikes} /> {likeCount} liked
                    by {data.postLikes[0].userName}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-28 right-0 z-20">
            <Stack
              direction={"column"}
              justifyContent={"space-between"}
              spacing={2}
            >
              <Stack direction={"column"} sx={{ width: "fit-content" }}>
                <IconButton onClick={handleLike}>
                  <img
                    src={isLike ? assets.likedRedIcon : assets.notificationIcon}
                    alt="like"
                    width={"30px"}
                  ></img>
                </IconButton>
                <IconButton onClick={openCommentsection}>
                  <img src={assets.commentIcon} alt="like" width={"30px"}></img>
                </IconButton>
                <IconButton>
                  <img src={assets.shareIcon} alt="like" width={"30px"}></img>
                </IconButton>
              </Stack>
              <div>
                {postUserName === user.userName ||
                  (true && (
                    <PopupState variant="popover" popupId="setting">
                      {(popupState) => (
                        <React.Fragment>
                          <IconButton
                            variant="contained"
                            {...bindTrigger(popupState)}
                          >
                            <MoreHorizIcon sx={{ color: "white" }} />
                          </IconButton>
                          <Menu {...bindMenu(popupState)}>
                            <MenuItem
                              className="text-red-500"
                              onClick={handleDeletePost}
                            >
                              Delete
                            </MenuItem>
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  ))}
              </div>
            </Stack>
          </div>
          {loader ? (
            <img
              src={
                "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
              }
              className="rounded"
              style={{ width: "100%" }}
              alt=""
            ></img>
          ) : (
            imgList &&
            imgList.length !== 0 && (
              <video
                poster={imgList[index].src}
                onDoubleClick={handleLike}
                src={imgList[index].src}
                autoPlay
                loop
                className="rounded "
                style={{
                  width: "100%",
                  height: "100vh",
                  aspectRatio: "9/16",
                  objectFit: "cover",
                }}
                alt=""
                loading="lazy"
              ></video>
            )
          )}

          {/* commentbox start */}
          <div
            className={`${
              openComment ? "block" : "hidden"
            } h-3/4 w-full bg-white flex flex-col  border-2 border-t rounded-t-lg rounded-r-lg absolute commentbox`}
            style={{
              aspectRatio: "9/16",
            }}
          >
            <div className="w-full flex justify-between items-center border-b-2">
              <span></span>
              <span>Comments</span>
              <IconButton onClick={openCommentsection}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className="overflow-scroll h-full">
              {data.postComments && data.postComments.length > 0 ? (
                <>
                  {data.postComments.map((element) => {
                    return (
                      <div
                        className="flex justify-between items-center text-white"
                        key={element.commentId}
                      >
                        <AvtarUserwithName
                          data={{
                            userName: element.userName,
                            userId: element.userId,
                            profilePictureName: element.avtar,
                          }}
                          comment={element.commentText}
                        ></AvtarUserwithName>
                        {element.userId === user.userId && (
                          <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={() => deleteCommment(element.commentId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="flex h-full justify-center items-center">
                  No Comments Yet, Add Your
                </div>
              )}
            </div>
            <div className=" bottom-0 absolute w-full bg-white">
              <TextField
                onChange={handleCommentChange}
                inputRef={commentBox}
                {...dynamicInputProps}
                fullWidth
                id="standard-multiline-flexible"
                label="Add a comment"
                multiline
                maxRows={4}
                variant="standard"
              />
            </div>
          </div>
          {/* commentbox end */}
        </div>
      </div>

      {/* <div className="my-2">
        {data.postComments.length > 0 && (
          <span role="button" onClick={openCommentsection}>
            View all {data.postComments.length} comments
          </span>
        )}
      </div> */}

      <Modal open={openListModal} onClose={handleClose}>
        <Box sx={style} className="rounded">
          <div className="flex justify-between border-b-2 items-center w-full font-semibold">
            <span></span>
            <span>{listName}</span>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>

          {listShow && listShow.length > 0 ? (
            <div
              className="overflow-scroll flex flex-col gap-3"
              style={{ maxHeight: "50vh" }}
            >
              {listShow.map((element) => {
                return (
                  <div className="flex justify-between" key={element.userId}>
                    <AvtarUserwithName
                      data={{
                        userName: element.userName,
                        userId: element.userId,
                        profilePictureName: element.avtar,
                      }}
                      key={element.userId}
                      onClick={handleClose}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <>Not Any</>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ReelContainer;
