import { Avatar, AvatarGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getprofilepic } from "../../redux/slices/UserActionSlice";

const AvatarGroupThree = ({ data }) => {
  const [profileList, setProfileList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const promises = data.map(async (item) => {
        const res = await dispatch(
          getprofilepic({
            userId: item.userId,
            photoName: item.avtar,
          })
        );
        return res.payload;
      });

      const results = await Promise.all(promises);
      setProfileList(results);
    };

    fetchData();
  }, [data, dispatch]);

  return (
    <div>
      <AvatarGroup max={3}>
        {profileList.length > 0 &&
          profileList.map((avatarUrl, index) => (
            <Avatar key={index} src={avatarUrl} />
          ))}
      </AvatarGroup>
    </div>
  );
};

export default AvatarGroupThree;
