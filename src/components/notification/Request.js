import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getprofilepic } from "../../redux/slices/UserActionSlice";
import { IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import AvtarUser from "../avtarofuser/AvtarUser";

const Request = ({ data, onClick }) => {
  // const [pic, setPic] = useState();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log(data);
  //   const fetchData = async () => {
  //     const res = await dispatch(
  //       getprofilepic({
  //         userId: data.user.userId,
  //         photoName: data.user.profilePictureName,
  //       })
  //     );
  //     setPic(res.payload);
  //   };
  //   fetchData();
  // }, [data]);
  return (
    <div className="flex p-2 items-center gap-3">
      <AvtarUser
        userId={data.user.userId}
        photoName={data.user.profilePictureName}
      />
      <div>{data.user.userName} requested to follow you..</div>
      <div className="flex gap-2">
        <div onClick={() => onClick(data.requestId, "Accept")}>
          <LoadingButton variant="contained">Accept</LoadingButton>
        </div>
        <div
          className="fm:hidden"
          onClick={() => onClick(data.requestId, "Cancel")}
        >
          <LoadingButton>Decline</LoadingButton>
        </div>
        <div
          className="fnm:hidden"
          onClick={() => onClick(data.requestId, "Cancel")}
        >
          <IconButton>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Request;
