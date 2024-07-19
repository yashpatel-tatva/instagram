import React, { useEffect } from "react";
import { assets } from "../constants/Assets";
import { Drawer, IconButton, Stack } from "@mui/material";
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
  userAction,
  useSelectorUserAction,
} from "../redux/slices/UserActionSlice";
import { Bounce, toast } from "react-toastify";
import AddSelectPopUp from "../components/addselector/AddSelectPopUp";
import Search from "../components/search/Search";
import Notificaion from "../components/notification/Notificaion";

const SideBottomBar = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleLogout() {
    dispatch(authAction.logout());
    dispatch(userAction.logout());
    navigate(AllRoutes.Home);
  }
  const { userid } = useSelectorUserState();
  const { success, Notification, ErrorMessage, isError, userPhoto } =
    useSelectorUserAction();

  useEffect(() => {
    if (success && Notification !== "") {
      // toast.success(Notification, {
      //   position: "top-right",
      //   autoClose: 1500,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      //   transition: Bounce,
      // });
    }
    if (isError) {
      // toast.error(ErrorMessage, {
      //   position: "top-right",
      //   autoClose: 1500,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      //   transition: Bounce,
      // });
    }
  }, [success, isError, Notification, ErrorMessage]);

  useEffect(() => {
    dispatch(getuserdata(userid));
  }, [dispatch, userid]);

  const [openSearch, setOpenSearch] = React.useState(false);

  const toggleSearchDrawer = (newOpen) => () => {
    if (newOpen) setOpenNotification(false);
    setOpenSearch(newOpen);
  };
  const [openNotification, setOpenNotification] = React.useState(false);

  const toggleNotificationDrawer = (newOpen) => () => {
    if (newOpen) setOpenSearch(false);
    setOpenNotification(newOpen);
  };

  return (
    <div className="displaytype w-screen z-30 relative">
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
              <div onClick={toggleSearchDrawer(true)}>
                <div
                  role="button"
                  className={`flex searchbtn gap-2 items-center ${
                    openSearch ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  <img
                    src={
                      openSearch ? assets.searchActiveIcon : assets.searchIcon
                    }
                    width={"28px"}
                    alt=""
                  />
                  <span className="md:hidden">Search</span>
                </div>
              </div>
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
              <div onClick={toggleNotificationDrawer(true)}>
                <div
                  role="button"
                  className={`flex gap-2 items-center ${
                    openNotification ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  <img
                    src={
                      openNotification
                        ? assets.notificationActiveIcon
                        : assets.notificationIcon
                    }
                    width={"28px"}
                    alt=""
                  />
                  <span className="md:hidden">Notification</span>
                </div>
              </div>
              <div>
                <AddSelectPopUp></AddSelectPopUp>
              </div>
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
            <PopupState variant="popover" popupId="setting">
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
      <div className="formobile bottombar w-screen z-50 ">
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
            {/* <div onClick={toggleSearchDrawer(true)}>
              <div
                role="button"
                className={`flex gap-2 items-center ${
                  openSearch ? "text-blue-500" : "text-gray-500"
                }`}
              >
                <img
                  src={openSearch ? assets.searchActiveIcon : assets.searchIcon}
                  width={"28px"}
                  alt=""
                />
                <span className="md:hidden">Search</span>
              </div>
            </div> */}
            <NavLink to={AllRoutes.Explore}>
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
        className="overflow-y-scroll  h-screen pb-12"
        style={{ overflowWrap: "anywhere" }}
      >
        {children}
      </div>
      <Drawer open={openSearch} onClose={toggleSearchDrawer(false)}>
        <div
          className="fm:w-screen h-screen"
          style={{ minWidth: "325px", maxWidth: "400px" }}
        >
          <Search closeDrawer={toggleSearchDrawer(false)}></Search>
        </div>
      </Drawer>
      <Drawer open={openNotification} onClose={toggleNotificationDrawer(false)}>
        <div
          className="fm:w-screen h-screen"
          style={{ minWidth: "325px", maxWidth: "400px" }}
        >
          <Notificaion
            closeDrawer={toggleNotificationDrawer(false)}
          ></Notificaion>
        </div>
      </Drawer>
    </div>
  );
};

export default SideBottomBar;
