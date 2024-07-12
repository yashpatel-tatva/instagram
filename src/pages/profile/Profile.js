import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { authAction, useSelectorUserState } from "../../redux/slices/AuthSlice";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import {
  folloerorfollowinglist,
  followrequest,
  getPostOrReel,
  getmediafromname,
  getotheruserdata,
  getpffcountofother,
  getpostfollowerfollowingcount,
  getuserdata,
  searchbyusername,
  useSelectorUserAction,
  userAction,
} from "../../redux/slices/UserActionSlice";
import SettingsIcon from "@mui/icons-material/Settings";
import ProfileLoader from "../../components/loaders/ProfileLoader";
import { Stack } from "@mui/system";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Snackbar,
  Tab,
  Tabs,
} from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AllRoutes } from "../../constants/AllRoutes";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import GestureIcon from "@mui/icons-material/Gesture";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import GridOnIcon from "@mui/icons-material/GridOn";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import PostContainer from "../../components/postcontainer/PostContainer";
import "../profile/Profile.css";
import AvtarUserwithName from "../../components/avtarofuser/AvtarUserwithName";
import QRCode from "react-qr-code";

const Profile = () => {
  const { userName } = useParams();
  useEffect(() => {}, [userName]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userid } = useSelectorUserState();
  const { user, userPhoto } = useSelectorUserAction();

  useEffect(() => {
    if (userName === user.userName) {
      navigate(AllRoutes.UserProfile);
    }
  }, [navigate, user.userName, userName]);

  const [postList, setPostList] = useState();
  const [showMedia, setShowMedia] = useState();
  const [imgList, setImgList] = useState([]);

  const [showProfileOf, setShowProfileOf] = useState();
  const [showCounts, setShowCounts] = useState({
    followingCount: 0,
    followeCount: 0,
    postCount: 0,
  });

  useEffect(() => {
    console.log(showProfileOf);
  }, []);

  useEffect(() => {
    dispatch(userAction.resetProfileUpdateFlag());
    if (userName) {
      const fetch = async () => {
        const formData = {
          pageNumber: 1,
          pageSize: 30,
          searchName: userName,
          model: {
            userId: userid,
          },
        };
        if (userName) {
          const res = await dispatch(searchbyusername(formData));
          const id = res.payload.data.record[0].userId;
          const userdata = await dispatch(getotheruserdata(id));
          setShowProfileOf(userdata.payload);
          const counts = await dispatch(getpffcountofother(id));
          setShowCounts(counts.payload.data);
        }
      };
      fetch();
    } else {
      setShowProfileOf(user);
      const fetch = async () => {
        const counts = await dispatch(getpffcountofother(userid));
        setShowCounts(counts.payload.data);
      };
      fetch();
    }
  }, [dispatch, userName, user, userid]);

  function handleLogout() {
    dispatch(authAction.logout());
    dispatch(userAction.logout());
    navigate(AllRoutes.Home);
  }
  const [value, setValue] = React.useState("Post");

  const handleChange = (event, newValue) => {
    setPostList();
    setValue(newValue);
  };

  useEffect(() => {
    // console.log("showProfileOf", showProfileOf);
  }, [showProfileOf]);

  /////////////////////////////////////////////////////////////////////

  useEffect(() => {
    let postList = [];
    if (showProfileOf) {
      if (Object.keys(showProfileOf).length > 0) {
        if (
          !userName ||
          showProfileOf.isFollowing ||
          !showProfileOf.isPrivate
        ) {
          const fetchData = async () => {
            const formData = {
              pageNumber: 1,
              pageSize: 50,
              model: {
                userId: showProfileOf.userId,
                postType: value === "Reel" ? "Reel" : "Post",
              },
            };
            try {
              const res = await dispatch(getPostOrReel(formData));
              const posts = res.payload.data.record;
              if (value !== "Media") {
                posts.forEach((element) => {
                  postList.push({
                    showPhoto: element.medias[0].mediaName,
                    count: element.medias.length,
                    posttype: element.postType,
                    postId: element.postId,
                  });
                });
                setShowMedia(postList);
              } else {
              }
              setPostList(posts);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };

          fetchData();
        }
      }
    }
  }, [value, userid, showProfileOf, dispatch]);

  useEffect(() => {
    if (showMedia) {
      setImgList([]);
      showMedia.forEach((element) => {
        const payload = {
          data: { postName: element.showPhoto, userId: showProfileOf.userId },
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
          };
          setImgList((old) => [...old, img]);
        };
        fetchData();
      });
    }
  }, [showMedia]);

  const [loader, setLoadrt] = useState(false);

  async function handleFollowClick() {
    setLoadrt(true);
    const data = {
      userId: userid,
      fromUserId: userid,
      toUserId: showProfileOf.userId,
    };
    await dispatch(followrequest(data));
    setLoadrt(false);
    const res = await dispatch(getpffcountofother(showProfileOf.userId));
    dispatch(getpostfollowerfollowingcount(userid));
    setShowCounts(res.payload.data);
    if (userName) {
      const userdata = await dispatch(getotheruserdata(showProfileOf.userId));
      setShowProfileOf(userdata.payload);
    } else {
      dispatch(getuserdata(showProfileOf.userId));
    }
  }

  ///////////////////follower/////////////////////
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
    if (!userName || !showProfileOf.isPrivate || showProfileOf.isFollowing) {
      setListName(value);
      const payload = {
        pageNumber: 1,
        pageSize: 110,
        searchName: "",
        model: {
          userId: showProfileOf.userId,
          followerOrFollowing: value,
        },
      };
      const res = await dispatch(folloerorfollowinglist(payload));
      setListShow(res.payload.data.record);
      setOpenListModal(true);
    }
  };
  const handleClose = () => {
    setOpenListModal(false);
    setOpenQR(false);
  };

  const [openQR, setOpenQR] = useState(false);
  const [copied, setCopied] = useState(false);

  function hadleQROpen() {
    setOpenQR(true);
  }
  const handleCopyClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setCopied(false);
  };

  ////////////////open post ////////////////////////////

  const [openPost, setOpenPost] = useState(false);
  const [postindex, setPostIndex] = useState(0);
  const [postToshow, setPostToShow] = useState();

  const [isNext, setIsNext] = useState(false);
  const [isPrev, setIsPrev] = useState(false);

  useEffect(() => {
    if (postList) {
      setIsNext(postindex < postList.length - 1);
      setIsPrev(postindex > 0);
    }
  }, [postList, postindex]);

  function hadnlePostClick(postId) {
    setPostIndex(postList.findIndex((post) => post.postId === postId));
    setPostToShow(postList.find((post) => post.postId === postId));
    setOpenPost(true);
  }
  useEffect(() => {
    if (postList) {
      setPostToShow(postList[postindex]);
    }
  }, [postList, postindex]);

  function next() {
    if (postindex < postList.length - 1) {
      setPostIndex((n) => n + 1);
    }
  }
  function prev() {
    if (postindex > 0) {
      setPostIndex((n) => n - 1);
    }
  }

  return (
    <div className="">
      {!showProfileOf ||
      (showProfileOf && !Object.keys(showProfileOf).length > 0) ? (
        <ProfileLoader
          className="w-1/5 p-3 md:w-2/5 mt-6 flex justify-center items-center"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <>
          <div className="fm:hidden mt-6 p-3 flex gap-7 border-b-2">
            <div
              className="flex justify-center items-center"
              style={{ maxWidth: "300px", minWidth: "100px" }}
            >
              <div className="w-full flex justify-center items-center">
                <img
                  className="rounded-full"
                  width={"150px"}
                  style={{ objectFit: "cover", aspectRatio: "1" }}
                  src={userName ? showProfileOf.profilePic : userPhoto}
                  alt="profile"
                ></img>
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex gap-6 sm:flex-col">
                  <span className="font-bold">{showProfileOf.userName}</span>
                  <div className="flex gap-8 items-center">
                    {userName ? (
                      <LoadingButton
                        loading={loader}
                        variant="contained"
                        disabled={loader}
                        onClick={handleFollowClick}
                        size="small"
                        sx={{
                          backgroundColor: `${
                            showProfileOf.isFollowing || showProfileOf.isRequest
                              ? "#e6e6e1"
                              : showProfileOf.isFollower
                              ? "#1976d2"
                              : "#1976d2"
                          }`,
                          color: `${
                            showProfileOf.isFollowing || showProfileOf.isRequest
                              ? "Black"
                              : "white"
                          }`,
                          fontSize: "small",
                        }}
                      >
                        {showProfileOf.isFollowing ? (
                          <>Following</>
                        ) : showProfileOf.isRequest ? (
                          <>Requested</>
                        ) : showProfileOf.isFollower ? (
                          <>Follow Back</>
                        ) : (
                          <>Follow</>
                        )}
                      </LoadingButton>
                    ) : (
                      <Link to={AllRoutes.EditProfile}>
                        <Button
                          size="small"
                          style={{
                            backgroundColor: "#e6e6e1",
                            color: "black",
                            fontSize: "small",
                          }}
                        >
                          Edit Profile
                        </Button>
                      </Link>
                    )}
                    <Link>
                      <Button
                        size="small"
                        style={{
                          backgroundColor: "#e6e6e1",
                          color: "black",
                          fontSize: "small",
                        }}
                        onClick={hadleQROpen}
                      >
                        Share Profile
                      </Button>
                    </Link>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <SettingsIcon {...bindTrigger(popupState)} />
                          <Menu {...bindMenu(popupState)}>
                            {userName ? (
                              <MenuItem>Block</MenuItem>
                            ) : (
                              <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            )}
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  </div>
                </div>
              </div>
              <div>
                <Stack spacing={4} direction={"row"} alignItems={"center"}>
                  <span>{showCounts.postCount} Posts</span>
                  <span
                    role="button"
                    onClick={() => handleListOpen("Follower")}
                  >
                    {showCounts.followeCount} Followers
                  </span>
                  <span
                    role="button"
                    onClick={() => handleListOpen("Following")}
                  >
                    {showCounts.followingCount} Following
                  </span>
                </Stack>
              </div>
              <div>
                <span className="font-bold">{showProfileOf.name}</span>
                <br></br>
                <span style={{ wordWrap: "wrap" }}>{showProfileOf.bio}</span>
                <br></br>
                <a href={showProfileOf.link} target="_blank" rel="noreferrer">
                  {showProfileOf.link}
                </a>
              </div>
            </div>
            <div></div>
          </div>
          <div className="fnm:hidden">
            <div
              className="w-screen justify-between flex border-b-2 "
              style={{ padding: "2% 4%" }}
            >
              <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <React.Fragment>
                    <SettingsIcon {...bindTrigger(popupState)} />
                    <Menu {...bindMenu(popupState)}>
                      {userName ? (
                        <MenuItem>Block</MenuItem>
                      ) : (
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      )}
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
              <span>{showProfileOf.userName}</span>
              <GestureIcon></GestureIcon>
            </div>
            <div className="flex gap-6">
              <div
                className="flex justify-center items-center py-4 ps-4"
                style={{ maxWidth: "100px", minWidth: "100px" }}
              >
                <div className="w-full flex justify-center items-center">
                  <img
                    className="rounded-full"
                    width={"150px"}
                    style={{ objectFit: "cover", aspectRatio: "1" }}
                    src={userName ? showProfileOf.profilePic : userPhoto}
                    alt="profile"
                  ></img>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-lg">{showProfileOf.userName}</span>
                <div className="">
                  <div className="flex gap-1 items-center">
                    {userName ? (
                      <LoadingButton
                        loading={loader}
                        variant="contained"
                        disabled={loader}
                        onClick={handleFollowClick}
                        size="small"
                        sx={{
                          backgroundColor: `${
                            showProfileOf.isFollowing || showProfileOf.isRequest
                              ? "#e6e6e1"
                              : showProfileOf.isFollower
                              ? "#1976d2"
                              : "#1976d2"
                          }`,
                          color: `${
                            showProfileOf.isFollowing || showProfileOf.isRequest
                              ? "Black"
                              : "white"
                          }`,
                          fontSize: "small",
                        }}
                      >
                        {showProfileOf.isFollowing ? (
                          <>Following</>
                        ) : showProfileOf.isRequest ? (
                          <>Requested</>
                        ) : showProfileOf.isFollower ? (
                          <>Follow Back</>
                        ) : (
                          <>Follow</>
                        )}
                      </LoadingButton>
                    ) : (
                      <Link to={AllRoutes.EditProfile}>
                        <Button
                          size="small"
                          style={{
                            backgroundColor: "#e6e6e1",
                            color: "black",
                            fontSize: "small",
                          }}
                        >
                          Edit Profile
                        </Button>
                      </Link>
                    )}
                    <Link>
                      <button
                        className="rounded text-sm p-1"
                        style={{
                          backgroundColor: "#e6e6e1",
                          color: "black",
                        }}
                        onClick={hadleQROpen}
                      >
                        Share Profile
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="ps-4">
              <p>{showProfileOf.name}</p>
              <br></br>
              <a href={showProfileOf.link} target="_blank" rel="noreferrer">
                {showProfileOf.link}
              </a>
              <br></br>
              <p>{showProfileOf.bio}</p>
            </div>
            <div className="border-t-2 border-b-2 py-2 my-2">
              <Stack direction={"row"} justifyContent={"space-around"}>
                <div className="text-center">
                  <div>{showCounts.postCount}</div>
                  <div>Posts</div>
                </div>
                <div
                  className="text-center"
                  role="button"
                  onClick={() => handleListOpen("Follower")}
                >
                  <div>{showCounts.followeCount}</div>
                  <div>Followers</div>
                </div>
                <div
                  className="text-center"
                  role="button"
                  onClick={() => handleListOpen("Following")}
                >
                  <div>{showCounts.followingCount}</div>
                  <div>Following</div>
                </div>
              </Stack>
            </div>
          </div>
          {!userName ||
          showProfileOf.isFollowing ||
          !showProfileOf.isPrivate ? (
            <>
              <div className="w-full flex items-center justify-center border-b-2">
                <TabContext value={value}>
                  <Box
                    className=""
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                  >
                    <TabList onChange={handleChange} sx={{ height: "60px" }}>
                      <Tab
                        icon={<GridOnIcon />}
                        iconPosition="start"
                        label="Post"
                        value="Post"
                        sx={{ padding: "10px 20px" }}
                      />
                      <Tab
                        icon={<ViewDayIcon />}
                        iconPosition="start"
                        label="Media"
                        value="Media"
                        sx={{ padding: "10px 20px" }}
                      ></Tab>
                      <Tab
                        icon={<MovieFilterIcon />}
                        label="Reel"
                        iconPosition="start"
                        value="Reel"
                        sx={{ padding: "10px 20px" }}
                      />
                    </TabList>
                  </Box>
                </TabContext>
              </div>
              <div className="flex flex-col items-center">
                {value !== "Media" ? (
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
                            className="imgvideolist h-full w-full"
                            src={item.src}
                            alt={item.title}
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                  </ImageList>
                ) : (
                  <div className="flex justify-center items-center  flex-col w-7/12">
                    {postList &&
                      postList.length !== 0 &&
                      postList.map((post) => (
                        <PostContainer
                          key={post.postId}
                          postdata={post}
                          postProfilePhoto={
                            userName ? showProfileOf.profilePic : userPhoto
                          }
                          postUserName={showProfileOf.userName}
                        ></PostContainer>
                      ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>Follow To See Posts</>
          )}
        </>
      )}

      {showProfileOf && (
        <Modal open={openQR} onClose={handleClose}>
          <Box
            sx={style}
            className="rounded flex flex-col gap-5 p-5 justify-center items-center"
          >
            <QRCode
              style={{ padding: "10px" }}
              value={
                window.location.origin +
                "/userprofile/" +
                showProfileOf.userName
              }
            ></QRCode>
            <div>
              <CopyToClipboard
                text={
                  window.location.origin +
                  "/userprofile/" +
                  showProfileOf.userName
                }
                onCopy={() => setCopied(true)}
              >
                <div className="border-2 text-center">
                  <span style={{ float: "left" }}>
                    {window.location.origin +
                      "/userprofile/" +
                      showProfileOf.userName}
                    <IconButton>
                      <ContentCopyIcon />
                    </IconButton>
                  </span>
                </div>
              </CopyToClipboard>
            </div>
          </Box>
        </Modal>
      )}

      <Snackbar
        style={{
          width: "fit-contain",
          backgroundColor: "white",
          color: "black",
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={copied}
        autoHideDuration={1000}
        onClose={handleCopyClose}
        message="Copied"
      />
      <Modal open={openListModal} onClose={handleClose}>
        <Box sx={style} className="rounded">
          <div className="flex justify-between border-b-2 items-center w-full font-semibold">
            <span></span>
            <span>{listName}</span>
            <IconButton onClick={handleClose}>
              {" "}
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
                      data={element}
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

      {/* ///openpost//// */}
      {openPost && (
        <Modal open onClose={() => setOpenPost(false)}>
          <Box
            sx={{ height: "100%" }}
            className="flex justify-center items-center"
          >
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
                key={postToshow.postId}
                postdata={postToshow}
                postProfilePhoto={
                  userName ? showProfileOf.profilePic : userPhoto
                }
                postUserName={showProfileOf.userName}
              ></PostContainer>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
