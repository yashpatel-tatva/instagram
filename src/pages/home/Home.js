import { Drawer, Stack } from "@mui/material";
import "../../App.css";
import instaTextLogo from "../../assets/img/png/instaTextLogo.png";
import { assets } from "../../constants/Assets";
import StoryScrollContainer from "../../components/storyscrollContainer/StoryScrollContainer";
import React, { useEffect, useState } from "react";
import AddSelectPopUp from "../../components/addselector/AddSelectPopUp";
import Notificaion from "../../components/notification/Notificaion";
import { useDispatch } from "react-redux";
import {
  postfeedlist,
  suggestionlist,
  useSelectorUserAction,
} from "../../redux/slices/UserActionSlice";
import AvtarUserwithName from "../../components/avtarofuser/AvtarUserwithName";
import PostContainer from "../../components/postcontainer/PostContainer";
import CircularProgress from "@mui/material/CircularProgress";
import AvtarUserwithFollowbtn from "../../components/avtarofuser/AvtarUserwithFollowbtn";

export const Home = () => {
  const [openNotification, setOpenNotification] = React.useState(false);

  const { user, userPhoto } = useSelectorUserAction();

  const toggleNotificationDrawer = (newOpen) => () => {
    setOpenNotification(newOpen);
  };

  const dispatch = useDispatch();

  const [suggestionList, setSuggestionList] = useState([]);
  const [isMoreSuggestion, setIsMoreSugestion] = useState(false);
  const [isSuggestionLoader, setIsSugestionLoader] = useState(true);
  const [pageNumberSuggestion, setPageNumberSuggestion] = useState(1);

  const [postfeedList, setPostfeedList] = useState([]);
  const [isMoreSPost, setIsMorePost] = useState(false);
  const [isSPostLoader, setIsPostLoader] = useState(true);
  const [pageNumberPost, setPageNumberPost] = useState(1);

  useEffect(() => {
    setIsSugestionLoader(true);
    const data = {
      pageNumber: pageNumberSuggestion,
      pageSize: Math.floor(window.innerHeight / 100),
    };
    const fetch = async () => {
      const res = await dispatch(suggestionlist(data));
      setSuggestionList((oldstate) => [
        ...oldstate,
        ...res.payload.data.record,
      ]);
      setIsMoreSugestion(res.payload.data.requirdPage !== pageNumberSuggestion);
      setIsSugestionLoader(false);
    };
    fetch();
  }, [pageNumberSuggestion]);

  function showmoreSugg() {
    setPageNumberSuggestion((n) => n + 1);
  }
  useEffect(() => {
    setIsPostLoader(true);
    const data = {
      pageNumber: pageNumberPost,
      pageSize: 6,
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

  return (
    <div>
      <div className="formobile sticky top-0 bg-white z-20 pb-3">
        <div
          className="w-screen justify-between flex border-b-2 "
          style={{ padding: "2% 4%" }}
        >
          <div className="flex" style={{ width: "fit-content" }}>
            <img src={instaTextLogo} alt="Instagram" width={"120px"}></img>
          </div>
          <Stack
            justifyContent={"space-between"}
            spacing={2}
            direction={"row"}
            alignItems={"center"}
          >
            <div>
              <AddSelectPopUp></AddSelectPopUp>
            </div>
            <div
              onClick={toggleNotificationDrawer(true)}
              role="button"
              className="flex gap-2 items-center"
              style={{ width: "fit-content" }}
            >
              <img
                src={
                  openNotification
                    ? assets.notificationActiveIcon
                    : assets.notificationIcon
                }
                width={"28px"}
                alt=""
              />{" "}
              <span className="md:hidden">Notification</span>
            </div>
          </Stack>
        </div>
      </div>
      <Drawer open={openNotification} onClose={toggleNotificationDrawer(false)}>
        <div className="fm:w-screen" style={{ minWidth: "325px" }}>
          <Notificaion
            closeDrawer={toggleNotificationDrawer(false)}
          ></Notificaion>
        </div>
      </Drawer>
      <div className="flex sticky top-0 fm:top-14 bg-white z-20 pb-3">
        <div className="flex flex-grow  w-7/12">
          <StoryScrollContainer />
        </div>
        <div className="w-3/12 lg:hidden flex justify-center items-center ">
          <AvtarUserwithName data={{ ...user }}></AvtarUserwithName>
        </div>
        <div className="formobile border-b-2"></div>
      </div>
      <div className="flex">
        <div className="flex justify-center items-start flex-grow">
          <Stack
            sx={{ width: "100%" }}
            justifyContent={"center"}
            alignItems="center"
          >
            {postfeedList &&
              postfeedList.length > 0 &&
              postfeedList.map((post) => (
                <PostContainer
                  key={post.postId}
                  postdata={post}
                ></PostContainer>
              ))}
            {isMoreSPost && (
              <div className="text-center p-4" onClick={showmorePost}>
                <p role="button" className="text-cyan-600 p-3">
                  {isSPostLoader ? <CircularProgress /> : "Load More"}
                </p>
              </div>
            )}
          </Stack>
        </div>
        <div className="w-3/12 lg:hidden overflow-scroll">
          <div className="font-semibold p-4 text-lg">Suggested for you</div>
          <Stack spacing={2}>
            {suggestionList &&
              suggestionList.length > 0 &&
              suggestionList.map((item) => {
                return (
                  <div key={item.userId}>
                    <AvtarUserwithFollowbtn
                      data={item}
                      setResult={setSuggestionList}
                    />
                  </div>
                );
              })}
          </Stack>
          {isMoreSuggestion && (
            <div className="text-center p-4" onClick={showmoreSugg}>
              <p role="button" className="text-cyan-600 p-3">
                {isSuggestionLoader ? (
                  <CircularProgress></CircularProgress>
                ) : (
                  "Show More"
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
