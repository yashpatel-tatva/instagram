import React, { useRef, useState, useEffect } from "react";
import styles from "./ScrollContainer.module.css";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import {
  storylisttoshow,
  useSelectorUserAction,
} from "../../redux/slices/UserActionSlice";
import { useDispatch } from "react-redux";
import { useSelectorUserState } from "../../redux/slices/AuthSlice";
import AvtarUser from "../avtarofuser/AvtarUser";
import StoryView from "./StoryView";
import { Modal } from "@mui/material";

function StoryScrollContainer({ list, onClick }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const { current } = scrollRef;
      if (current) {
        setShowLeftButton(current.scrollLeft > 50);
        setShowRightButton(
          current.scrollLeft < current.scrollWidth - current.clientWidth - 50
        );
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 500;
      if (direction === "left") {
        current.scrollTo({
          left: current.scrollLeft - scrollAmount,
          behavior: "smooth",
        });
      } else {
        current.scrollTo({
          left: current.scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const startDragging = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const dispatch = useDispatch();
  const { userid } = useSelectorUserState();
  const { stories, user, userPhoto } = useSelectorUserAction();
  useEffect(() => {
    if (!Object.keys(stories).length > 0) {
      const data = {
        pageNumber: 1,
        pageSize: 100,
        searchName: "",
        model: {
          userId: userid,
        },
      };
      dispatch(storylisttoshow(data));
    }
  }, []);

  const [storyopen, setStoryOpen] = useState(false);
  const [storyIndextoshow, setStoryIndextoshow] = useState(0);
  const [storylist, setStorylist] = useState([]);

  useEffect(() => {
    const storiesall = stories.record;
    const storyper =
      storiesall &&
      storiesall.flatMap((element) =>
        element.stories.map((item, index) => ({
          userId: element.userId,
          userName: element.userName,
          profilePictureName: element.profilePictureName,
          index: index + 1,
          outOf: element.stories.length,
          ...item,
        }))
      );
    setStorylist(storyper || []);
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
      (item) => item.userId === userId && item.isSeen === false
    );
    if (storyIndex !== -1) {
      setStoryIndextoshow(storyIndex);
      setStoryOpen(true);
    } else {
      const newstoryindex = storylist.findIndex(
        (item) => item.userId === userId
      );
      setStoryIndextoshow(newstoryindex);
      setStoryOpen(true);
    }
  }

  function handleseen(storyId) {
    // setStorylist((prevStorylist) =>
    //   prevStorylist.map((story) =>
    //     story.storyId === storyId ? { ...story, isSeen: true } : story
    //   )
    // );
  }

  return (
    <div
      style={{ display: "flex", gap: "15px", position: "relative" }}
      className="w-full p-3"
    >
      {/* Model start Here  */}

      {storyopen && (
        <Modal open onClose={() => setStoryOpen(false)}>
          <StoryView
            key={storyIndextoshow}
            data={storylist[storyIndextoshow]}
            isNext={storyIndextoshow < storylist.length - 1}
            isPrev={storyIndextoshow > 0}
            next={NextStory}
            prev={PrevStory}
            handleCloseStoryView={() => setStoryOpen(false)}
            handleseen={handleseen}
          />
        </Modal>
      )}

      {/* Model end Here */}

      <div
        ref={scrollRef}
        className={styles.populerscroll}
        onMouseDown={startDragging}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onMouseMove={onDrag}
      >
        {showLeftButton && (
          <button
            style={{ left: "10px" }}
            className={`${styles.scrollbtns} rounded-full border-2 uptotab bg-slate-500 `}
            onClick={() => scroll("left")}
          >
            <ChevronLeftOutlinedIcon color="white" fontSize="large" />
          </button>
        )}
        <div className="flex flex-col justify-center items-center">
          <div
            className="flex items-center justify-center rounded-full border"
            style={{ height: "70px", width: "70px" }}
          >
            <AvtarUser
              sx={{
                height: "100%",
                width: "100%",
                aspectRatio: "1",
                border: "2px solid red",
              }}
              src={userPhoto}
            ></AvtarUser>
          </div>
          <div className="text-sm">{user.userName}</div>
        </div>
        {stories.record &&
          stories.record.length > 0 &&
          stories.record.map((element, index) => {
            return (
              <div
                key={index}
                className="flex flex-col justify-center items-center"
              >
                <div
                  className="flex items-center justify-center rounded-full border"
                  style={{ height: "70px", width: "70px" }}
                  onClick={() => handleStoryClick(element.userId)}
                >
                  <AvtarUser
                    sx={{
                      height: "100%",
                      width: "100%",
                      aspectRatio: "1",
                      border: `2px solid ${
                        element.stories.find((item) => item.isSeen === false)
                          ? "red"
                          : "gray"
                      }`,
                    }}
                    userId={element.userId}
                    photoName={element.profilePictureName}
                  ></AvtarUser>
                </div>
                <div className="text-sm">{element.userName}</div>
              </div>
            );
          })}
        {showRightButton && (
          <button
            style={{ right: "10px" }}
            className={`${styles.scrollbtns} rounded-full border-2 uptotab bg-slate-500 `}
            onClick={() => scroll("right")}
          >
            <ChevronRightOutlinedIcon color="white" fontSize="large" />
          </button>
        )}
      </div>
    </div>
  );
}

export default StoryScrollContainer;
