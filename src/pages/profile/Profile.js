import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authAction, useSelectorUserState } from "../../redux/slices/AuthSlice";
import {
  followrequest,
  getPostOrReel,
  getmediafromname,
  getotheruserdata,
  getuserdata,
  searchbyusername,
  useSelectorUserAction,
  userAction,
} from "../../redux/slices/UserActionSlice";
import SettingsIcon from "@mui/icons-material/Settings";
import ProfileLoader from "../../components/loaders/ProfileLoader";
import { Stack } from "@mui/system";
import { Box, Button, Menu, MenuItem, Tab, Tabs } from "@mui/material";
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

const Profile = () => {
  const { userName } = useParams();
  useEffect(() => {}, [userName]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userid } = useSelectorUserState();
  const { user, loading, userPhoto } = useSelectorUserAction();

  const [postList, setPostList] = useState();
  const [showMedia, setShowMedia] = useState();
  const [imgList, setImgList] = useState([]);

  const [showProfileOf, setShowProfileOf] = useState();

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
        }
      };
      fetch();
    } else {
      setShowProfileOf(user);
    }
  }, [dispatch, userName, user, userid]);

  function handleLogout() {
    dispatch(authAction.logout());
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

  function hadnlePostClick(postId) {
    console.log(postId);
  }

  const [loader, setLoadrt] = useState(false);

  async function handleFollowClick() {
    setLoadrt(true);
    const data = {
      userId: userid,
      fromUserId: userid,
      toUserId: showProfileOf.userId,
    };
    const res = await dispatch(followrequest(data));
    if (res.payload.isSuccess) {
      if (userName) {
        const userdata = await dispatch(getotheruserdata(showProfileOf.userId));
        setShowProfileOf(userdata.payload);
      }
    }
    setLoadrt(false);
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
                        // style={{
                        //   backgroundColor: `${
                        //     showProfileOf.isFollowing
                        //       ? "#e6e6e1"
                        //       : showProfileOf.isFollower
                        //       ? "#1976d2"
                        //       : "#1976d2"
                        //   }`,
                        //   color: `${
                        //     showProfileOf.isFollowing ? "Black" : "white"
                        //   }`,
                        //   fontSize: "small",
                        // }}
                      >
                        {showProfileOf.isFollowing ? (
                          <>Following</>
                        ) : showProfileOf.isFollower ? (
                          <>Follow Back</>
                        ) : showProfileOf.isRequest ? (
                          <>Requested</>
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
                  <span>{showProfileOf.postCount} Posts</span>
                  <span>{showProfileOf.followeCount} Followers</span>
                  <span>{showProfileOf.followingCount} Following</span>
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
                      <Button
                        size="small"
                        style={{
                          backgroundColor: "#e6e6e1",
                          color: "black",
                          fontSize: "small",
                        }}
                      >
                        FollowUnFollow
                      </Button>
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
                  <div>{showProfileOf.postCount}</div>
                  <div>Posts</div>
                </div>
                <div className="text-center">
                  <div>{showProfileOf.followeCount}</div>
                  <div>Followers</div>
                </div>
                <div className="text-center">
                  <div>{showProfileOf.followingCount}</div>
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
                            className="h-full w-full"
                            src={item.src}
                            alt={item.title}
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                  </ImageList>
                ) : (
                  <>
                    {postList &&
                      postList.length !== 0 &&
                      postList.map((post) => (
                        <PostContainer
                          key={post.postId}
                          data={post}
                        ></PostContainer>
                      ))}
                  </>
                )}
              </div>
            </>
          ) : (
            <>Follow To See Posts</>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
