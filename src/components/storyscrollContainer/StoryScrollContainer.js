import React, { useRef, useState, useEffect } from "react";
import styles from "./ScrollContainer.module.css";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import {
  personalstorylist,
  storylisttoshow,
  useSelectorUserAction,
} from "../../redux/slices/UserActionSlice";
import { useDispatch } from "react-redux";
import { useSelectorUserState } from "../../redux/slices/AuthSlice";
import AvtarUser from "../avtarofuser/AvtarUser";
import StoryView from "./StoryView";
import { Modal } from "@mui/material";
import { useFilePicker } from "use-file-picker";
import {
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";
import { toast, ToastContainer } from "react-toastify";
import CaptionAndConfirm from "../addselector/CaptionAndConfirm";

function StoryScrollContainer({ list, onClick }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

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
      handleScroll();
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
  const { stories, user, userPhoto, personalstories } = useSelectorUserAction();
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
    if (!Object.keys(personalstories).length > 0) {
      dispatch(personalstorylist());
    }
  }, []);

  const [storyopen, setStoryOpen] = useState(false);
  const [storyIndextoshow, setStoryIndextoshow] = useState(0);
  const [storylist, setStorylist] = useState([]);

  useEffect(() => {
    const storiesall = stories.record;
    const ps = personalstories.record;

    const personalStories = ps
      ? ps.flatMap((element) =>
          element.stories
            .slice()
            .reverse()
            .map((item, index) => ({
              userId: element.userId,
              userName: element.userName,
              profilePictureName: element.profilePictureName,
              index: index + 1, // Adjusting index if needed
              outOf: element.stories.length,
              ...item,
            }))
        )
      : [];

    const storyper = storiesall
      ? storiesall.flatMap((element) =>
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

    const combinedStories = [...personalStories, ...storyper];

    setStorylist(combinedStories || []);
  }, [personalstories, stories]);

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
    } else if (userid === userId) {
      handlePostClick("Story");
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
        userId: userid,
      },
    };
    dispatch(storylisttoshow(data));
    dispatch(personalstorylist());
  }

  //////////////////  Story //////////////////

  const [postData, setPostData] = useState({ PostType: null, Files: null });
  const [multiple, setMultiple] = useState(true);
  const [triggerPicker, setTriggerPicker] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const { openFilePicker, loading, errors } = useFilePicker({
    multiple: multiple,
    readAs: "DataURL",
    accept: ["image/*", "video/*"],
    onFilesSelected: ({ filesContent }) => {
      setPostData((prevState) => ({
        ...prevState,
        Files: filesContent,
      }));
    },
    validators: [
      new FileSizeValidator({ maxFileSize: 1 * 1024 * 1024 }),
      new FileTypeValidator([
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "mp4",
        "mov",
        "avi",
        "mkv",
        "wmv",
        "mp3",
        "wav",
        "ogg",
      ]),
    ],
  });

  function handlePostClick(value) {
    setMultiple(value === "Post");
    setPostData({ PostType: value, Files: null });
    setIsSelected(false);
    setTriggerPicker(true);
  }

  useEffect(() => {
    if (triggerPicker) {
      openFilePicker();
      setTriggerPicker(false);
    }
  }, [triggerPicker, multiple, openFilePicker]);

  useEffect(() => {
    if (postData.Files) {
      setIsSelected(true);
    }
  }, [postData]);

  useEffect(() => {
    if (errors.length) {
      toast.error(errors[0].reason);
    }
  }, [errors]);
  useEffect(() => {
    const { current } = scrollRef;
    if (current) {
      setShowRightButton(current.scrollWidth > current.clientWidth);
    }
  }, [storylist]);
  return (
    <div
      style={{ display: "flex", gap: "15px", position: "relative" }}
      className="w-full p-3 storycontainer"
    >
      <ToastContainer></ToastContainer>

      {/* Model start Here  */}

      {storyopen && (
        <Modal open onClose={handleCloseStoryView}>
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
        <div
          className="flex flex-col justify-center items-center"
          style={{ width: "80px" }}
        >
          <div
            className="flex items-center justify-center rounded-full border"
            style={{ height: "70px", width: "70px" }}
            onClick={() => handleStoryClick(userid)}
          >
            <AvtarUser
              sx={{
                height: "100%",
                width: "100%",
                aspectRatio: "1",
                border: `2px solid ${
                  !!storylist.find(
                    (item) =>
                      item.userId.toString() === userid.toString() &&
                      item.isSeen === false
                  )
                    ? "red"
                    : "gray"
                }`,
              }}
              story={false}
              userId={user.userId}
              photoName={user.profilePictureName}
              userName={user.userName}
            ></AvtarUser>
          </div>
          <div className="text-sm w-full whitespace-nowrap overflow-hidden text-ellipsis">
            {user.userName}
          </div>
        </div>
        {stories.record &&
          stories.record.length > 0 &&
          stories.record.map((element, index) => {
            return (
              <div
                key={index}
                className="flex flex-col justify-center items-center"
                style={{ width: "80px" }}
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
                    }}
                    story={false}
                    userId={element.userId}
                    photoName={element.profilePictureName}
                  ></AvtarUser>
                </div>
                <div className="text-sm w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {element.userName}
                </div>
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
      {isSelected && <CaptionAndConfirm data={postData} />}
    </div>
  );
}

export default StoryScrollContainer;
