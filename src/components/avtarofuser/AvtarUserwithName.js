import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AvtarUser from "./AvtarUser";

const AvtarUserwithName = ({ data, onClick, comment = "" }) => {
  return (
    <Link to={`/userprofile/${data.userName}`} onClick={onClick}>
      <div className="flex gap-4 px-4 items-center">
        <div>
          <AvtarUser userId={data.userId} photoName={data.profilePictureName} />
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
