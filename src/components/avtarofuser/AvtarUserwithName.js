import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AvtarUser from "./AvtarUser";
import { useSelectorUserAction } from "../../redux/slices/UserActionSlice";
import { AllRoutes } from "../../constants/AllRoutes";

const AvtarUserwithName = ({ data, onClick, comment = "", story = true }) => {
  const { user } = useSelectorUserAction();
  return (
    <div className="flex gap-4  items-center w-fit">
      <div>
        <AvtarUser
          userId={data.userId}
          photoName={data.profilePictureName}
          story={story}
          userName={data.userName}
        />
      </div>
      <Link
        to={
          user.userId === data.userId
            ? AllRoutes.UserProfile
            : `/userprofile/${data.userName}`
        }
        style={{ display: "flex", width: "fit-content" }}
        onClick={onClick}
      >
        <div>
          <div className="text-lg font-semibold">{data.userName}</div>
          <div>
            {comment !== "" ? (
              <span>{comment}</span>
            ) : data.name ? (
              data.name
            ) : (
              data.userName
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AvtarUserwithName;
