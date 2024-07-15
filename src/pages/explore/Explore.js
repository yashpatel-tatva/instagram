import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getmediafromname,
  postfeedlist,
  useSelectorUserAction,
} from "../../redux/slices/UserActionSlice";
import { IconButton, ImageList, ImageListItem, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import PostContainer from "../../components/postcontainer/PostContainer";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import CircularProgress from "@mui/material/CircularProgress";

const Explore = () => {
  const dispatch = useDispatch();

  const { user } = useSelectorUserAction();

  const [postfeedList, setPostfeedList] = useState([]);
  const [isMoreSPost, setIsMorePost] = useState(false);
  const [isSPostLoader, setIsPostLoader] = useState(true);
  const [pageNumberPost, setPageNumberPost] = useState(1);

  const [showMedia, setShowMedia] = useState();
  const [imgList, setImgList] = useState([]);

  useEffect(() => {
    setIsPostLoader(true);
    const data = {
      pageNumber: pageNumberPost,
      pageSize: 15,
    };
    const fetch = async () => {
      const res = await dispatch(postfeedlist(data));
      setPostfeedList((oldstate) => [...oldstate, ...res.payload.data.record]);
      setIsMorePost(res.payload.data.requirdPage !== pageNumberPost);
      setIsPostLoader(false);
    };
    fetch();
  }, [pageNumberPost]);

  function showmorePost() {
    setPageNumberPost((n) => n + 1);
  }

  useEffect(() => {
    let postList = [];
    console.log(postfeedList);
    postfeedList.forEach((element) => {
      postList.push({
        showPhoto: element.medias[0].mediaName,
        count: element.medias.length,
        posttype: element.postType,
        postId: element.postId,
        userId: element.userId,
        likesCount: element.postLikes.length,
        commentCount: element.postComments.length,
      });
    });
    setShowMedia(postList);
  }, [postfeedList]);

  useEffect(() => {
    console.log(imgList);
  }, [imgList]);

  useEffect(() => {
    if (showMedia) {
      setImgList([]);
      showMedia.forEach((element) => {
        const payload = {
          data: { postName: element.showPhoto, userId: element.userId },
          type: element.posttype,
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
            likesCount: element.likesCount,
            commentCount: element.commentCount,
          };
          setImgList((old) => [...old, img]);
        };
        fetchData();
      });
    }
  }, [showMedia]);

  const [openPost, setOpenPost] = useState(false);
  const [postindex, setPostIndex] = useState(0);
  const [postToshow, setPostToShow] = useState();

  const [isNext, setIsNext] = useState(false);
  const [isPrev, setIsPrev] = useState(false);

  useEffect(() => {
    if (postfeedList) {
      setIsNext(postindex < postfeedList.length - 1);
      setIsPrev(postindex > 0);
    }
  }, [postfeedList, postindex]);

  function hadnlePostClick(postId) {
    setPostIndex(postfeedList.findIndex((post) => post.postId === postId));
    setPostToShow(postfeedList.find((post) => post.postId === postId));
    setOpenPost(true);
  }
  useEffect(() => {
    if (postfeedList) {
      setPostToShow(postfeedList[postindex]);
    }
  }, [postfeedList, postindex]);

  function next() {
    if (postindex < postfeedList.length - 1) {
      setPostIndex((n) => n + 1);
    }
  }
  function prev() {
    if (postindex > 0) {
      setPostIndex((n) => n - 1);
    }
  }

  return (
    <div>
      <ImageList cols={3} gap={0}>
        {imgList &&
          imgList.length !== 0 &&
          imgList.map((item) => (
            <ImageListItem
              key={item.postId}
              onClick={() => {
                hadnlePostClick(item.postId);
              }}
            >
              <video
                poster={item.src}
                autoPlay
                loop
                className="imgvideolist h-full w-full "
                src={item.src}
                alt={item.title}
                loading="lazy"
              />
              {item.count > 1 && (
                <div className="absolute top-1 right-1 text-white shadow-lg">
                  <FilterNoneIcon />
                </div>
              )}
              <div className="absolute flex items-center h-full w-full justify-center opacity-0 hover:backdrop-brightness-50 gap-5 hover:opacity-100 text-white ">
                <span>
                  <ChatBubbleIcon /> {item.commentCount}
                </span>
                <span>
                  <FavoriteIcon /> {item.likesCount}
                </span>
              </div>
            </ImageListItem>
          ))}
      </ImageList>
      {isMoreSPost && (
        <div className="text-center p-4" onClick={showmorePost}>
          <p role="button" className="text-cyan-600 p-3">
            {isSPostLoader ? <CircularProgress /> : "Load More"}
          </p>
        </div>
      )}

      {/* open Post */}
      {openPost && (
        <Modal open onClose={() => setOpenPost(false)}>
          <div className="flex justify-center items-center h-full">
            <IconButton
              sx={{
                position: "absolute",
                zIndex: "4",
                right: "1%",
                top: "1%",
                backgroundColor: "white",
                "&:hover": { backgroundColor: "pink" },
              }}
              onClick={() => setOpenPost(false)}
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
            <div className="bg-white w-1/2 md:w-3/4  fm:w-full fm:h-full flex justify-center items-center">
              <PostContainer
                style={{ maxHeight: "100%" }}
                key={postToshow.postId}
                postdata={postToshow}
              ></PostContainer>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Explore;
