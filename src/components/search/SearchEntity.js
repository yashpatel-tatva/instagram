import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getprofilepic } from "../../redux/slices/UserActionSlice";
import { Avatar } from "@mui/material";
import { AllRoutes } from "../../constants/AllRoutes";
import { Link } from "react-router-dom";

const SearchEntity = ({ data }) => {
  const dispatch = useDispatch();

  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await dispatch(
        getprofilepic({
          userId: data.userId,
          photoName: data.profilePictureName,
        })
      );
      setProfile(res.payload);
    };
    fetchData();
  }, []);

  return (
    <Link to={`userprofile/${data.userName}`}>
      <div className="flex gap-4 px-4 items-center">
        <div>
          <Avatar sx={{ border: "1px solid black" }} src={profile}></Avatar>
        </div>
        <div>
          <div className="text-lg font-semibold">{data.userName}</div>
          <div>{data.name ? data.name : data.userName}</div>
        </div>
      </div>
    </Link>
  );
};

export default SearchEntity;
