import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getprofilepic } from "../../redux/slices/UserActionSlice";

const AvtarUser = ({ sx = {}, src = "", userId, photoName = "" }) => {
  const [profile, setProfile] = useState(src);
  const dispatch = useDispatch();
  useEffect(() => {
    if (src === "" && userId) {
      const fetchData = async () => {
        const res = await dispatch(
          getprofilepic({
            userId: userId,
            photoName: photoName,
          })
        );
        setProfile(res.payload);
      };
      fetchData();
    }
  }, [dispatch, photoName, src, userId]);
  return <Avatar sx={sx} alt="profile" src={profile} />;
};

export default AvtarUser;
