import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AvtarUser from "./AvtarUser";

const AvtarUserwithName = ({ data, onClick, comment = "" }) => {
  return (
    <Link
      to={`/userprofile/${data.userName}`}
      style={{ display: "flex", width: "fit-content" }}
      onClick={onClick}
    >
      <div className="flex gap-4 px-4 items-center w-fit">
        <div>
          <AvtarUser
            userId={data.userId}
            photoName={data.profilePictureName}
            src={data.src ?? ""}
          />
        </div>
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
      </div>
    </Link>
  );
};

export default AvtarUserwithName;
