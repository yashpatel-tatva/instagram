import { Avatar, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getprofilepic,
  personalstorylist,
  storylisttoshow,
  useSelectorUserAction,
} from "../../redux/slices/UserActionSlice";
import StoryView from "../storyscrollContainer/StoryView";
import { useNavigate } from "react-router-dom";
import { AllRoutes } from "../../constants/AllRoutes";

const AvtarUser = ({
  sx = {},
  src = "",
  userId,
  photoName = "",
  userName,
  story = true,
}) => {
  const [profile, setProfile] = useState(src);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  /////////////stories/////////////////

  const { stories, user, personalstories } = useSelectorUserAction();

  const [hasStory, setHasStory] = useState();
  const [unseenStory, setUnseenStory] = useState();
  const [storylist, setStorylist] = useState();

  const [storyopen, setStoryOpen] = useState(false);
  const [storyIndextoshow, setStoryIndextoshow] = useState(0);

  useEffect(() => {
    let storyrecord = [];
    if (userId !== user.userId && stories && stories.record) {
      storyrecord = stories.record.filter((x) => x.userId === userId);
      setHasStory(storyrecord.length > 0);
      setUnseenStory(storyrecord.find((x) => x.isSeen === false));
    } else if (userId === user.userId) {
      if (personalstories && personalstories.record) {
        storyrecord = personalstories.record;
        setHasStory(personalstories.record.length > 0);
        setUnseenStory(personalstories.record.find((x) => x.isSeen === false));
      }
    }
    const storyper = storyrecord
      ? storyrecord.flatMap((element) =>
          element.stories
            .slice()
            .reverse()
            .map((item, index) => ({
              userId: element.userId,
              userName: element.userName,
              profilePictureName: element.profilePictureName,
              index: index + 1,
              outOf: element.stories.length,
              ...item,
            }))
        )
      : [];
    setStorylist(storyper);
  }, [stories]);

  function PrevStory() {
    if (storyIndextoshow > 0) {
      setStoryIndextoshow((prevIndex) => prevIndex - 1);
    }
  }

  function NextStory() {
    if (storyIndextoshow < storylist.length - 1) {
      setStoryIndextoshow((prevIndex) => prevIndex + 1);
    }
  }

  function handleStoryClick(userId) {
    const storyIndex = storylist.findIndex(
      (item) =>
        item.userId.toString() === userId.toString() && item.isSeen === false
    );
    const newstoryindex = storylist.findIndex(
      (item) => item.userId.toString() === userId.toString()
    );
    if (storyIndex !== -1) {
      setStoryIndextoshow(storyIndex);
      setStoryOpen(true);
    } else if (newstoryindex !== -1) {
      setStoryIndextoshow(newstoryindex);
      setStoryOpen(true);
    } else {
      navigate(
        userId === user.userId
          ? AllRoutes.UserProfile
          : `/userprofile/${userName}`
      );
    }
  }

  function handleseen(storyId) {
    console.log("story seen :", storyId);
  }

  function handleCloseStoryView() {
    setStoryOpen(false);
    const data = {
      pageNumber: 1,
      pageSize: 100,
      searchName: "",
      model: {
        userId: user.userId,
      },
    };
    dispatch(storylisttoshow(data));
    dispatch(personalstorylist());
  }

  return (
    <>
      <Avatar
        sx={{
          ...sx,
          border:
            storylist &&
            `2px solid ${
              storylist.find((item) => item.isSeen === false)
                ? "red"
                : hasStory
                ? "gray"
                : "transperant"
            }`,
        }}
        alt="profile"
        src={profile}
        onClick={() => {
          story && handleStoryClick(userId);
        }}
      />
      {story && storyopen && (
        <Modal
          open={storyopen}
          onClose={handleCloseStoryView}
          disableEscapeKeyDown={false}
        >
          <StoryView
            key={storyIndextoshow}
            data={storylist[storyIndextoshow]}
            isNext={storyIndextoshow < storylist.length - 1}
            isPrev={storyIndextoshow > 0}
            next={NextStory}
            prev={PrevStory}
            handleCloseStoryView={handleCloseStoryView}
            handleseen={handleseen}
          />
        </Modal>
      )}
    </>
  );
};

export default AvtarUser;
