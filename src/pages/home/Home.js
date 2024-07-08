import { Drawer, Menu, MenuItem, Stack } from "@mui/material";
import "../../App.css";
import instaTextLogo from "../../assets/img/png/instaTextLogo.png";
import { assets } from "../../constants/Assets";
import StoryScrollContainer from "../../components/storyscrollContainer/StoryScrollContainer";
import PostContainer from "../../components/postcontainer/PostContainer";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import React from "react";
import GridOnIcon from "@mui/icons-material/GridOn";
import HistoryToggleOffTwoToneIcon from "@mui/icons-material/HistoryToggleOffTwoTone";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import AddSelectPopUp from "../../components/addselector/AddSelectPopUp";
import Notificaion from "../../components/notification/Notificaion";

export const Home = () => {
  const [openNotification, setOpenNotification] = React.useState(false);

  const toggleNotificationDrawer = (newOpen) => () => {
    setOpenNotification(newOpen);
  };

  return (
    <div>
      <div className="formobile">
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
      <div>
        <div>
          <StoryScrollContainer />
        </div>
        <div className="formobile border-b-2"></div>
      </div>
      <div className="flex">
        <div className="flex justify-center flex-grow">
          <Stack justifyContent={"center"} alignItems="center">
            {/* <PostContainer />
            <PostContainer /> */}
          </Stack>
        </div>
        <div className="w-3/12 sm:hidden">Hi</div>
      </div>
    </div>
  );
};
