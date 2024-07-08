import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../constants/Assets";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EllipsisTextUptoTwo from "../ellipsisTextTwoline/EllipsisTextUptoTwo";
import {
  commentonpost,
  getmediafromname,
  likeunlikepost,
  userAction,
  useSelectorUserAction,
} from "../../redux/slices/UserActionSlice";
import { useDispatch } from "react-redux";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SendIcon from "@mui/icons-material/Send";

const PostContainer = ({ data }) => {
  const dispatch = useDispatch();

  const { user, updaterender, userPhoto } = useSelectorUserAction();
  const [postUserName, setPostUserName] = useState();
  const [postProfilePhoto, setPostProfilePhoto] = useState();
  const [mediaName, setMediaName] = useState();
  const [imgList, setImgList] = useState();
  const [isLike, setIsLike] = useState(
    !!data.postLikes.find((element) => element.userId === user.userId)
  );
  const [likeCount, setLikeCount] = useState(data.postLikes.length);

  useEffect(() => {
    if (data.userId !== user.userId) {
      // call for getting userID
      // then set there photo and username from that
    } else {
      setPostUserName(user.userName);
      setPostProfilePhoto(userPhoto);
    }
    let medialist = [];
    data.medias.map((media) =>
      medialist.push({ userId: data.userId, postName: media.mediaName })
    );
    setMediaName(medialist);
  }, []);

  useEffect(() => {
    if (mediaName) {
      setImgList([]);
      mediaName.forEach((element) => {
        const payload = {
          data: element,
          type: "Post",
        };
        const fetchData = async () => {
          const res = await dispatch(getmediafromname(payload));
          const img = {
            src:
              "data:" +
              res.payload.data.fileType +
              ";base64, " +
              res.payload.data.imageBase64,
            count: element.count,
            postId: element.postId,
          };
          setImgList((old) => [...old, img]);
        };
        fetchData();
      });
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

  async function handleLike() {
    !isLike ? setLikeCount((n) => n + 1) : setLikeCount((n) => n - 1);
    setIsLike(!isLike);
    const payload = {
      userId: user.userId,
      postId: data.postId,
      isLike: !isLike,
    };
    const res = await dispatch(likeunlikepost(payload));
    await dispatch(userAction.updaterender());
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
    const payload = {
      userId: user.userId,
      postId: data.postId,
      commentText: commentBox.current.value,
    };
    const res = await dispatch(commentonpost(payload));
    await dispatch(userAction.updaterender());
  }

  function openComment() {
    console.log(data.postComments);
  }

  return (
    <div
      value={updaterender}
      className="w-6/12 md:w-9/12 fm:w-full border-b-2 fnm:border-0"
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div
            role="button"
            className="flex gap-2 items-center py-2"
            style={{ width: "fit-content" }}
          >
            <Avatar src={postProfilePhoto} alt="" />{" "}
          </div>
          <div className="font-semibold">{postUserName}</div>
        </div>
        <div>
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </div>
      </div>
      <div className="relative">
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
        <div>
          {imgList && imgList.length !== 0 && (
            <img
              src={imgList[index].src}
              className="rounded"
              style={{ width: "100%" }}
              alt=""
            ></img>
          )}
        </div>
      </div>
      <div className="flex justify-between py-2">
        <Stack spacing={2} direction={"row"} sx={{ width: "fit-content" }}>
          <IconButton onClick={handleLike}>
            <img
              src={isLike ? assets.likedRedIcon : assets.notificationIcon}
              alt="like"
              width={"30px"}
            ></img>
          </IconButton>
          <IconButton onClick={openComment}>
            <img src={assets.commentIcon} alt="like" width={"30px"}></img>
          </IconButton>
          <IconButton>
            <img src={assets.shareIcon} alt="like" width={"30px"}></img>
          </IconButton>
        </Stack>
        <IconButton>
          <img src={assets.bookmarkIcon} alt="like" width={"30px"}></img>
        </IconButton>
      </div>
      <div>
        <span>{likeCount} likes</span>
      </div>
      <div>
        <span>{postUserName}</span>
        <EllipsisTextUptoTwo text={data.caption}></EllipsisTextUptoTwo>
      </div>
      <div className="my-2">
        {data.postComments.length > 2 && (
          <span role="button" onClick={openComment}>
            View all {data.postComments.length} comments
          </span>
        )}
      </div>
      <div className="my-2">
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
  );
};

export default PostContainer;
