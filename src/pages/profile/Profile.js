import React, { useDebugValue, useEffect, useId } from "react";
import { useDispatch } from "react-redux";
import { authAction, useSelectorUserState } from "../../redux/slices/AuthSlice";
import {
  getuserdata,
  useSelectorUserAction,
  userAction,
} from "../../redux/slices/UserActionSlice";
import SettingsIcon from "@mui/icons-material/Settings";
import ProfileLoader from "../../components/loaders/ProfileLoader";
import { Stack } from "@mui/system";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AllRoutes } from "../../constants/AllRoutes";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import GestureIcon from "@mui/icons-material/Gesture";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userid } = useSelectorUserState();
  const { user, loading, userPhoto } = useSelectorUserAction();

  useEffect(() => {
    dispatch(userAction.resetProfileUpdateFlag());
    dispatch(getuserdata(userid));
  }, [dispatch, userid]);
  function handleLogout() {
    dispatch(authAction.logout());
    navigate(AllRoutes.Home);
  }
  return (
    <div className="">
      {loading ? (
        <ProfileLoader
          className="w-1/5 mt-6 p-3 md:w-2/5 mt-6 flex justify-center items-center"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <>
          <div className="fm:hidden mt-6 p-3 flex gap-7">
            <div
              className="flex justify-center items-center"
              style={{ maxWidth: "300px", minWidth: "100px" }}
            >
              <div className="w-full flex justify-center items-center">
                <img
                  className="rounded-full"
                  width={"150px"}
                  style={{ objectFit: "cover", aspectRatio: "1" }}
                  src={userPhoto}
                  alt="profile"
                ></img>
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex gap-6 sm:flex-col">
                  <span className="font-bold">{user.userName}</span>
                  <div className="flex gap-8 items-center">
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
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  </div>
                </div>
              </div>
              <div>
                <Stack spacing={4} direction={"row"} alignItems={"center"}>
                  <span>{user.postCount} Posts</span>
                  <span>{user.followeCount} Followers</span>
                  <span>{user.followingCount} Following</span>
                </Stack>
              </div>
              <div>
                <span className="font-bold">{user.name}</span>
                <br></br>
                <span style={{ wordWrap: "wrap" }}>{user.bio}</span>
                <a href={user.link} target="_blank">
                  {user.link}
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
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
              <span>{user.userName}</span>
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
                    src={userPhoto}
                    alt="profile"
                  ></img>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-lg">{user.userName}</span>
                <div className="">
                  <div className="flex gap-1 items-center">
                    <Link to={AllRoutes.EditProfile}>
                      <button
                        className="rounded text-sm p-1 px-3"
                        style={{
                          backgroundColor: "#e6e6e1",
                          color: "black",
                        }}
                      >
                        Edit Profile
                      </button>
                    </Link>
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
              <p>{user.name}</p>
              <p>{user.link}</p>
              <p>{user.bio}</p>
            </div>
            <div className="border-t-2 border-b-2 py-2 my-2">
              <Stack direction={"row"} justifyContent={"space-around"}>
                <div className="text-center">
                  <div>{user.postCount}</div>
                  <div>Posts</div>
                </div>
                <div className="text-center">
                  <div>{user.followeCount}</div>
                  <div>Followers</div>
                </div>
                <div className="text-center">
                  <div>{user.followingCount}</div>
                  <div>Following</div>
                </div>
              </Stack>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
