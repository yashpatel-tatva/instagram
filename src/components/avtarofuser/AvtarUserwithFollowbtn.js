import React, { useState } from "react";
import AvtarUserwithName from "./AvtarUserwithName";
import { LoadingButton } from "@mui/lab";
import { useSelectorUserState } from "../../redux/slices/AuthSlice";
import { useDispatch } from "react-redux";
import {
  followrequest,
  getotheruserdata,
  getpostfollowerfollowingcount,
} from "../../redux/slices/UserActionSlice";

const AvtarUserwithFollowbtn = ({ data, onclick, setResult, followclass }) => {
  const { userid } = useSelectorUserState();
  const dispatch = useDispatch();
  const [loader, setLoadrt] = useState(false);
  async function handleFollowClick(touserid) {
    setLoadrt(true);
    const data = {
      userId: userid,
      fromUserId: userid,
      toUserId: touserid,
    };
    await dispatch(followrequest(data));
    dispatch(getpostfollowerfollowingcount(userid));
    const userdata = await dispatch(getotheruserdata(touserid));
    setResult((prevResult) =>
      prevResult.map((user) =>
        user.userId === touserid ? { ...user, ...userdata.payload } : user
      )
    );
    setLoadrt(false);
  }
  return (
    <div className="flex justify-between ">
      <AvtarUserwithName
        onClick={onclick}
        data={{ ...data, name: "NoNeedName" }}
      ></AvtarUserwithName>
      {userid.toString() !== data.userId.toString() && (
        <LoadingButton
          loading={loader}
          variant="text"
          disabled={loader}
          onClick={() => handleFollowClick(data.userId)}
          size="small"
          sx={followclass}
        >
          {data.isFollowing ? (
            <>Following</>
          ) : data.isRequest ? (
            <>Requested</>
          ) : data.isFollower ? (
            <>Follow Back</>
          ) : (
            <>Follow</>
          )}
        </LoadingButton>
      )}
    </div>
  );
};

export default AvtarUserwithFollowbtn;
