import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { postfeedlist } from "../../redux/slices/UserActionSlice";
import ReelContainer from "../../components/postcontainer/ReelContainer";

const Reels = () => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const [reelFeedList, setReelFeedList] = useState([]);
  const [isMoreReel, setIsMoreReel] = useState(false);
  const [isReelLoader, setIsReelLoader] = useState(true);
  const [pageNumberReel, setPageNumberReel] = useState(1);

  useEffect(() => {
    const sections = containerRef.current.querySelectorAll(".section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.scrollIntoView({ behavior: "smooth" });
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [reelFeedList]);

  useEffect(() => {
    setIsReelLoader(true);
    const data = {
      pageNumber: pageNumberReel,
      pageSize: 1,
      searchName: "",
      model: {
        postType: "Reel",
      },
    };
    const fetch = async () => {
      const res = await dispatch(postfeedlist(data));
      setReelFeedList((oldState) => [...oldState, ...res.payload.data.record]);
      setIsMoreReel(res.payload.data.requirdPage !== pageNumberReel);
      setIsReelLoader(false);
    };
    fetch();
  }, [pageNumberReel, dispatch]);

  const showMorePost = () => {
    if (isMoreReel) {
      setPageNumberReel((n) => n + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        containerRef.current.scrollTop + containerRef.current.clientHeight >=
        containerRef.current.scrollHeight
      ) {
        showMorePost();
      }
    };

    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [isMoreReel]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col overflow-y-auto h-screen snap-y snap-mandatory"
    >
      {reelFeedList.map((reel, index) => (
        <div
          key={index}
          className="section flex h-screen items-center justify-center snap-start"
          style={{ flex: "0 0 100vh" }}
        >
          <ReelContainer key={reel.postId} postdata={reel}></ReelContainer>
        </div>
      ))}
      {isReelLoader && <div>Loading...</div>}
    </div>
  );
};

export default Reels;
