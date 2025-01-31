import React from "react";
import { IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import AvtarUser from "../avtarofuser/AvtarUser";

const Request = ({ data, onClick }) => {
  return (
    <div className="flex p-2 items-center gap-3">
      <AvtarUser
        userId={data.user.userId}
        photoName={data.user.profilePictureName}
        userName={data.user.userName}
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
