import { IconButton, CircularProgress, Stack, Modal } from "@mui/material";
import React, { useEffect, useState, useRef, useCallback } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useDispatch } from "react-redux";
import { useSelectorUserState } from "../../redux/slices/AuthSlice";
import {
  getpostbyid,
  notificationlist,
  requestacceptorcancel,
  requestList,
} from "../../redux/slices/UserActionSlice";
import Request from "./Request";
import AvtarUserwithName from "../avtarofuser/AvtarUserwithName";
import PostContainer from "../postcontainer/PostContainer";
import CloseIcon from "@mui/icons-material/Close";

const Notificaion = ({ closeDrawer }) => {
  const dispatch = useDispatch();
  const { userid } = useSelectorUserState();

  const [requests, setRequests] = useState([]);
  const [notiList, setNotiList] = useState([]);

  const [pageNumberRequest, setPageNumberRequest] = useState(1);
  const [pageNumberNotification, setPageNumberNotification] = useState(1);

  const [isMoreRequest, setIsMoreRequest] = useState(false);
  const [isRequestLoader, setIsRequestLoader] = useState(true);

  const [isMoreNotification, setIsMoreNotification] = useState(false);
  const [isNotificationLoader, setIsNotificationLoader] = useState(true);

  const observer = useRef();

  useEffect(() => {
    const fetchRequests = async () => {
      setIsRequestLoader(true);
      const data = {
        pageNumber: pageNumberRequest,
        pageSize: 10,
        searchName: "string",
        model: {
          userId: userid,
          toUserId: 0,
        },
      };
      const res = await dispatch(requestList(data));
      setRequests((prev) => [...prev, ...res.payload.data.record]);
      setIsMoreRequest(res.payload.data.requirdPage !== pageNumberRequest);
      setIsRequestLoader(false);
    };
    fetchRequests();
  }, [dispatch, userid, pageNumberRequest]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsNotificationLoader(true);
      const data = {
        pageNumber: pageNumberNotification,
        pageSize: 10,
      };
      const res = await dispatch(notificationlist(data));
      setNotiList((prev) => [...prev, ...res.payload.data.record]);
      setIsMoreNotification(
        res.payload.data.requirdPage !== pageNumberNotification
      );
      setIsNotificationLoader(false);
    };
    fetchNotifications();
  }, [dispatch, pageNumberNotification]);

  const showMoreRequests = () => {
    setPageNumberRequest((prev) => prev + 1);
  };

  const loadMoreNotifications = useCallback(() => {
    setPageNumberNotification((prev) => prev + 1);
  }, []);

  const lastNotificationElementRef = useCallback(
    (node) => {
      if (isNotificationLoader) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && isMoreNotification) {
          loadMoreNotifications();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isNotificationLoader, isMoreNotification, loadMoreNotifications]
  );

  const handleAcceptDecline = async (requestId, value) => {
    const data = {
      pageNumber: 1,
      pageSize: 10,
      searchName: "string",
      model: {
        userId: userid,
        toUserId: 0,
      },
    };
    await dispatch(
      requestacceptorcancel({ requestId: requestId, accpetType: value })
    );
    const res = await dispatch(requestList(data));
    setRequests(res.payload.data.record);
  };

  const [openPost, setOpenPost] = useState(false);
  const [postToshow, setPostToShow] = useState();

  async function handleClick(noty) {
    if (noty.postId !== 0) {
      const res = await dispatch(
        getpostbyid({ postType: "Post", postId: noty.postId })
      );
      if (res.payload.isSuccess) {
        setOpenPost(true);
        setPostToShow(res.payload.data);
      }
    }
  }

  return (
    <div className="h-full">
      <div
        className="flex justify-between p-2 items-center border-b-2"
        style={{ height: "5%" }}
      >
        <IconButton aria-label="close" onClick={closeDrawer} className="">
          <ArrowBackIosNewIcon />
        </IconButton>
        <span className="font-semibold">Notification</span>
        <span></span>
      </div>
      <div className="overflow-scroll" style={{ height: "95%" }}>
        <div className="border-b-2">
          {requests && requests.length > 0 ? (
            <div>
              {requests.map((element) => (
                <Request
                  key={element.requestId}
                  data={element}
                  onClick={handleAcceptDecline}
                />
              ))}
              {isMoreRequest && (
                <div className="text-center p-4" onClick={showMoreRequests}>
                  <p role="button" className="text-cyan-600 p-3">
                    {isRequestLoader ? <CircularProgress /> : "Show More"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center w-full">No request Found</p>
          )}
        </div>
        <div>
          {notiList && notiList.length > 0 ? (
            <div className="overflow-scroll h-full">
              {notiList.map((element, index) => {
                if (notiList.length === index + 1) {
                  return (
                    <div
                      ref={lastNotificationElementRef}
                      key={element.requestId}
                    >
                      <AvtarUserwithName
                        data={{
                          userName: element.userName,
                          userId: element.userId,
                          profilePictureName: element.profileName,
                        }}
                        comment={element.message}
                        onClick={() => handleClick(element)}
                      />
                    </div>
                  );
                } else {
                  return (
                    <AvtarUserwithName
                      key={element.requestId}
                      data={{
                        userName: element.userName,
                        userId: element.userId,
                        profilePictureName: element.profileName,
                      }}
                      comment={element.message}
                      onClick={() => handleClick(element)}
                    />
                  );
                }
              })}
              {isNotificationLoader && (
                <div className="text-center p-4">
                  <CircularProgress />
                </div>
              )}
            </div>
          ) : (
            <p className="text-center w-full">No Notification Found</p>
          )}
        </div>
      </div>
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

export default Notificaion;
