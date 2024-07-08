import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useDispatch } from "react-redux";
import { useSelectorUserState } from "../../redux/slices/AuthSlice";
import {
  requestacceptorcancel,
  requestList,
} from "../../redux/slices/UserActionSlice";
import Request from "./Request";

const Notificaion = ({ closeDrawer }) => {
  const dipatch = useDispatch();
  const { userid } = useSelectorUserState();

  const [requets, setRequests] = useState();

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
    const fetch = async () => {
      const res = await dipatch(requestList(data));
      setRequests(res.payload.data.record);
    };
    fetch();
  }, [dipatch, userid]);

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
    const res = await dipatch(
      requestacceptorcancel({ requestId: requestId, accpetType: value })
    );
    console.log(res);
    const newres = await dipatch(requestList(data));
    setRequests(res.payload.data.record);
  }

  return (
    <div>
      <div className="flex justify-between p-2  items-center">
        <IconButton aria-label="delete" onClick={closeDrawer} className="">
          <ArrowBackIosNewIcon />
        </IconButton>
        <span className="font-semibold">Notification</span>
        <span></span>
      </div>
      <div>
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
          <span>No request Found</span>
        )}
      </div>
    </div>
  );
};

export default Notificaion;
