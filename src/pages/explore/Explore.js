import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  getmediafromname,
  postfeedlist,
  useSelectorUserAction,
} from "../../redux/slices/UserActionSlice";
import {
  IconButton,
  ImageList,
  ImageListItem,
  Modal,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import PostContainer from "../../components/postcontainer/PostContainer";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { assets } from "../../constants/Assets";

const Explore = () => {
  const dispatch = useDispatch();
  const { user } = useSelectorUserAction();

  const [postfeedList, setPostfeedList] = useState([]);
  const [isMoreSPost, setIsMorePost] = useState(false);
  const [isSPostLoader, setIsPostLoader] = useState(true);
  const [pageNumberPost, setPageNumberPost] = useState(1);

  const [showMedia, setShowMedia] = useState([]);
  const [imgList, setImgList] = useState([]);

  const [openPost, setOpenPost] = useState(false);
  const [postindex, setPostIndex] = useState(0);
  const [postToshow, setPostToShow] = useState();

  const [isNext, setIsNext] = useState(false);
  const [isPrev, setIsPrev] = useState(false);

  const observer = useRef();

  // Fetch posts on page number change
  useEffect(() => {
    const fetchPosts = async () => {
      setIsPostLoader(true);
      const data = {
        pageNumber: pageNumberPost,
        pageSize: 9,
        searchName: "",
        model: {
          postType: null,
        },
      };
      const res = await dispatch(postfeedlist(data));
      const newPosts = res.payload.data.record;

      setPostfeedList((prevPosts) => [...prevPosts, ...newPosts]);
      setIsMorePost(res.payload.data.requirdPage !== pageNumberPost);
      setIsPostLoader(false);
    };
    fetchPosts();
  }, [pageNumberPost, dispatch]);

  // Prepare showMedia when postfeedList updates
  useEffect(() => {
    const newShowMedia = postfeedList.map((element) => ({
      showPhoto: element.medias[0].mediaName,
      count: element.medias.length,
      posttype: element.postType,
      postId: element.postId,
      userId: element.userId,
      likesCount: element.postLikes.length,
      commentCount: element.postComments.length,
    }));
    setShowMedia(newShowMedia);
  }, [postfeedList]);

  // Fetch images based on showMedia
  useEffect(() => {
    const fetchImages = async () => {
      const newImgList = await Promise.all(
        showMedia.map(async (element) => {
          const payload = {
            data: { postName: element.showPhoto, userId: element.userId },
            type: element.posttype,
          };
          const res = await dispatch(getmediafromname(payload));
          return {
            src: `data:${res.payload.data.fileType};base64,${res.payload.data.imageBase64}`,
            count: element.count,
            postId: element.postId,
            likesCount: element.likesCount,
            commentCount: element.commentCount,
          };
        })
      );
      setImgList(newImgList); // Only update with new image list
    };
    if (showMedia.length) {
      fetchImages();
    }
  }, [showMedia, dispatch]);

  useEffect(() => {
    setIsNext(postindex < postfeedList.length - 1);
    setIsPrev(postindex > 0);
  }, [postfeedList, postindex]);

  const handlePostClick = (postId) => {
    const index = postfeedList.findIndex((post) => post.postId === postId);
    setPostIndex(index);
    setPostToShow(postfeedList[index]);
    setOpenPost(true);
  };

  useEffect(() => {
    setPostToShow(postfeedList[postindex]);
  }, [postfeedList, postindex]);

  const loadMorePosts = useCallback(() => {
    setIsPostLoader(true);
    setPageNumberPost((prev) => prev + 1);
  }, []);

  const lastPostElementRef = useCallback(
    (node) => {
      if (isSPostLoader) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && isMoreSPost) {
          loadMorePosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isSPostLoader, isMoreSPost, loadMorePosts]
  );

  const next = () =>
    postindex < postfeedList.length - 1 && setPostIndex((n) => n + 1);
  const prev = () => postindex > 0 && setPostIndex((n) => n - 1);

  function opensearch() {
    document.getElementsByClassName("searchbtn")[0].click();
  }
  return (
    <div>
      <div className="hidden fm:flex w-full  p-2">
        <div
          className="border-2 w-full flex gap-4 p-1 rounded-lg"
          onClick={opensearch}
        >
          <img src={assets.searchActiveIcon} width={"20px"} alt="" /> Search
        </div>
      </div>
      <ImageList cols={3} gap={0}>
        {imgList.map((item, index) => {
          if (imgList.length === index + 1) {
            return (
              <ImageListItem
                key={item.postId}
                ref={lastPostElementRef}
                onClick={() => handlePostClick(item.postId)}
              >
                <video
                  poster={item.src}
                  autoPlay
                  loop
                  className="imgvideolist h-full w-full"
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                />
                {item.count > 1 && (
                  <div className="absolute top-1 right-1 text-white shadow-lg">
                    <FilterNoneIcon />
                  </div>
                )}
                <div className="absolute flex items-center h-full w-full justify-center opacity-0 hover:backdrop-brightness-50 gap-5 hover:opacity-100 text-white">
                  <span>
                    <ChatBubbleIcon /> {item.commentCount}
                  </span>
                  <span>
                    <FavoriteIcon /> {item.likesCount}
                  </span>
                </div>
              </ImageListItem>
            );
          } else {
            return (
              <ImageListItem
                key={item.postId}
                onClick={() => handlePostClick(item.postId)}
              >
                <video
                  poster={item.src}
                  autoPlay
                  loop
                  className="imgvideolist h-full w-full"
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                />
                {item.count > 1 && (
                  <div className="absolute top-1 right-1 text-white shadow-lg">
                    <FilterNoneIcon />
                  </div>
                )}
                <div className="absolute flex items-center h-full w-full justify-center opacity-0 hover:backdrop-brightness-50 gap-5 hover:opacity-100 text-white">
                  <span>
                    <ChatBubbleIcon /> {item.commentCount}
                  </span>
                  <span>
                    <FavoriteIcon /> {item.likesCount}
                  </span>
                </div>
              </ImageListItem>
            );
          }
        })}
      </ImageList>
      {isSPostLoader && (
        <div className="text-center p-4">
          <CircularProgress />
        </div>
      )}

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
              <CloseIcon />
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
            <div className=" w-1/2 md:w-3/4 fm:w-full fm:h-full flex justify-center items-center">
              <PostContainer
                style={{ maxHeight: "100%" }}
                key={postToshow.postId}
                postdata={postToshow}
                maxHeight={"90vh"}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Explore;
