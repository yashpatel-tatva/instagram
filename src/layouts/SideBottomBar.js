import React, { useEffect } from "react";
import { assets } from "../constants/Assets";
import { IconButton, Stack } from "@mui/material";
import "../App.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AllRoutes } from "../constants/AllRoutes";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useDispatch } from "react-redux";
import { authAction, useSelectorUserState } from "../redux/slices/AuthSlice";
import {
  getuserdata,
  useSelectorUserAction,
} from "../redux/slices/UserActionSlice";
import { Bounce, ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const SideBottomBar = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleLogout() {
    dispatch(authAction.logout());
    navigate(AllRoutes.Home);
  }
  const { userid } = useSelectorUserState();
  console.log(userid);
  const { success, Notification, ErrorMessage, isError, userPhoto } =
    useSelectorUserAction();

  useEffect(() => {
    if (success && Notification !== "") {
      toast.success(Notification, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    if (isError) {
      toast.error(ErrorMessage, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }, [success, isError, Notification, ErrorMessage]);

  useEffect(() => {
    dispatch(getuserdata(userid));
  }, [dispatch, userid]);

  return (
    <div className="displaytype w-screen">
      {/* <ToastContainer></ToastContainer> */}
      <div className="uptotab sidebar float-left">
        <div
          className="h-screen p-5 border-r-2 flex flex-col justify-between"
          style={{ width: "fit-content" }}
        >
          <Stack spacing={5}>
            <div className="flex gap-2" style={{ width: "fit-content" }}>
              <img src={assets.instaIcon} width={"30px"} alt="" />{" "}
            </div>
            <Stack spacing={2}>
              <NavLink to={AllRoutes.Home}>
                {({ isActive }) => (
                  <div
                    role="button"
                    className={`flex gap-2 items-center ${
                      isActive ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <img
                      src={isActive ? assets.homeActiveIcon : assets.homeIcon}
                      width={"28px"}
                      alt=""
                    />
                    <span className="md:hidden">Home</span>
                  </div>
                )}
              </NavLink>
              <NavLink to={AllRoutes.Search}>
                {({ isActive }) => (
                  <div
                    role="button"
                    className={`flex gap-2 items-center ${
                      isActive ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <img
                      src={
                        isActive ? assets.searchActiveIcon : assets.searchIcon
                      }
                      width={"28px"}
                      alt=""
                    />
                    <span className="md:hidden">Search</span>
                  </div>
                )}
              </NavLink>
              <NavLink to={AllRoutes.Explore}>
                {({ isActive }) => (
                  <div
                    role="button"
                    className={`flex gap-2 items-center ${
                      isActive ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <img
                      src={
                        isActive ? assets.exploreActiveIcon : assets.exploreIcon
                      }
                      width={"28px"}
                      alt=""
                    />
                    <span className="md:hidden">Explore</span>
                  </div>
                )}
              </NavLink>
              <NavLink to={AllRoutes.Reels}>
                {({ isActive }) => (
                  <div
                    role="button"
                    className={`flex gap-2 items-center ${
                      isActive ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <img
                      src={isActive ? assets.reelsActiveIcon : assets.reelsIcon}
                      width={"28px"}
                      alt=""
                    />
                    <span className="md:hidden">Reels</span>
                  </div>
                )}
              </NavLink>
              <NavLink to={AllRoutes.Messages}>
                {({ isActive }) => (
                  <div
                    role="button"
                    className={`flex gap-2 items-center ${
                      isActive ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <img
                      src={isActive ? assets.dmsActiveIcon : assets.dmsIcon}
                      width={"28px"}
                      alt=""
                    />
                    <span className="md:hidden">Messages</span>
                  </div>
                )}
              </NavLink>
              <NavLink to={AllRoutes.Notification}>
                {({ isActive }) => (
                  <div
                    role="button"
                    className={`flex gap-2 items-center ${
                      isActive ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <img
                      src={
                        isActive
                          ? assets.notificationActiveIcon
                          : assets.notificationIcon
                      }
                      width={"28px"}
                      alt=""
                    />
                    <span className="md:hidden">Notification</span>
                  </div>
                )}
              </NavLink>
              <NavLink>
                {/* {({ isActive }) => ( */}
                <div role="button" className={`flex gap-2 items-center`}>
                  <img src={assets.addIcon} width={"28px"} alt="" />
                  <span className="md:hidden">Add</span>
                </div>
                {/* )} */}
              </NavLink>
              <NavLink to={AllRoutes.UserProfile}>
                {({ isActive }) => (
                  <div
                    role="button"
                    className={`flex rounded-full w-fit gap-2 items-center ${
                      isActive ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <img
                      src={userPhoto}
                      className={`rounded-full  ${
                        isActive ? "border-2 border-gray-950" : ""
                      }`}
                      width={"28px"}
                      style={{
                        aspectRatio: "1",
                        objectFit: "cover",
                      }}
                      alt=""
                    />
                    <span className="md:hidden">Profile</span>
                  </div>
                )}
              </NavLink>
            </Stack>
          </Stack>
          <div>
            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <React.Fragment>
                  <IconButton variant="contained" {...bindTrigger(popupState)}>
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
          </div>
        </div>
      </div>
      <div className="formobile bottombar w-screen">
        <div className="w-full border-t-2" style={{ padding: "2%" }}>
          <Stack direction={"row"} justifyContent={"space-around"}>
            <NavLink to={AllRoutes.Home}>
              {({ isActive }) => (
                <div
                  role="button"
                  className={`flex gap-2 items-center ${
                    isActive ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  <img
                    src={isActive ? assets.homeActiveIcon : assets.homeIcon}
                    width={"28px"}
                    alt=""
                  />
                  <span className="md:hidden">Home</span>
                </div>
              )}
            </NavLink>
            <NavLink to={AllRoutes.Search}>
              {({ isActive }) => (
                <div
                  role="button"
                  className={`flex gap-2 items-center ${
                    isActive ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  <img
                    src={isActive ? assets.searchActiveIcon : assets.searchIcon}
                    width={"28px"}
                    alt=""
                  />
                  <span className="md:hidden">Search</span>
                </div>
              )}
            </NavLink>
            <NavLink to={AllRoutes.Reels}>
              {({ isActive }) => (
                <div
                  role="button"
                  className={`flex gap-2 items-center ${
                    isActive ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  <img
                    src={isActive ? assets.reelsActiveIcon : assets.reelsIcon}
                    width={"28px"}
                    alt=""
                  />
                  <span className="md:hidden">Reels</span>
                </div>
              )}
            </NavLink>
            <NavLink to={AllRoutes.Messages}>
              {({ isActive }) => (
                <div
                  role="button"
                  className={`flex gap-2 items-center ${
                    isActive ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  <img
                    src={isActive ? assets.dmsActiveIcon : assets.dmsIcon}
                    width={"28px"}
                    alt=""
                  />
                  <span className="md:hidden">Messages</span>
                </div>
              )}
            </NavLink>
            <NavLink to={AllRoutes.UserProfile}>
              {({ isActive }) => (
                <div
                  role="button"
                  className={`flex rounded-full w-fit gap-2 items-center ${
                    isActive ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  <img
                    src={userPhoto}
                    className={`rounded-full  ${
                      isActive ? "border-2 border-gray-950" : ""
                    }`}
                    width={"28px"}
                    alt=""
                    style={{
                      aspectRatio: "1",
                      objectFit: "cover",
                    }}
                  />
                  <span className="md:hidden">Profile</span>
                </div>
              )}
            </NavLink>
          </Stack>
        </div>
      </div>
      <div
        className="overflow-y-scroll  h-screen"
        style={{ overflowWrap: "anywhere" }}
      >
        {children}
      </div>
    </div>
  );
};

export default SideBottomBar;
