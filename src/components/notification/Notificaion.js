import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useDispatch } from "react-redux";
import { useSelectorUserState } from "../../redux/slices/AuthSlice";
import {
  notificationlist,
  requestacceptorcancel,
  requestList,
} from "../../redux/slices/UserActionSlice";
import Request from "./Request";
import AvtarUserwithName from "../avtarofuser/AvtarUserwithName";

const Notificaion = ({ closeDrawer }) => {
  const dispatch = useDispatch();
  const { userid } = useSelectorUserState();

  const [requets, setRequests] = useState();
  const [notiList, setNotiList] = useState();

  useEffect(() => {
    const data = {
      pageNumber: 1,
      pageSize: 10,
      searchName: "string",
      model: {
        userId: userid,
        toUserId: 0,
      },
    };
    const fetchRequest = async () => {
      const res = await dispatch(requestList(data));
      setRequests(res.payload.data.record);
    };
    fetchRequest();
  }, [dispatch, userid]);

  useEffect(() => {
    const data = {
      pageNumber: 1,
      pageSize: 110,
    };
    const fetchNotification = async () => {
      const res = await dispatch(notificationlist(data));
      setNotiList(res.payload.data.record);
    };
    fetchNotification();
  }, []);

  async function handleAcceptDecline(requestId, value) {
    const data = {
      pageNumber: 1,
      pageSize: 10,
      searchName: "string",
      model: {
        userId: userid,
        toUserId: 0,
      },
    };
    const res = await dispatch(
      requestacceptorcancel({ requestId: requestId, accpetType: value })
    );
    console.log(res);
    const newres = await dispatch(requestList(data));
    setRequests(newres.payload.data.record);
  }

  return (
    <div className="h-full ">
      <div
        className="flex justify-between p-2  items-center border-b-2"
        style={{ height: "5%" }}
      >
        <IconButton aria-label="delete" onClick={closeDrawer} className="">
          <ArrowBackIosNewIcon />
        </IconButton>
        <span className="font-semibold">Notification</span>
        <span></span>
      </div>
      <div className="overflow-scroll" style={{ height: "95%" }}>
        <div className="border-b-2">
          {requets && requets.length > 0 ? (
            <div>
              {requets.map((element) => {
                return (
                  <Request
                    key={element.requestId}
                    data={element}
                    onClick={handleAcceptDecline}
                  ></Request>
                );
              })}
            </div>
          ) : (
            <p className="text-center w-full">No request Found</p>
          )}
        </div>
        <div>
          {notiList && notiList.length > 0 ? (
            <div className="overflow-scroll h-full">
              {notiList.map((element) => {
                return (
                  <AvtarUserwithName
                    key={element.requestId}
                    data={{
                      userName: element.userName,
                      userId: element.userId,
                      profilePictureName: element.profileName,
                    }}
                    comment={element.message}
                    onClick={closeDrawer}
                  ></AvtarUserwithName>
                );
              })}
            </div>
          ) : (
            <p className="text-center w-full">No Notification Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notificaion;
