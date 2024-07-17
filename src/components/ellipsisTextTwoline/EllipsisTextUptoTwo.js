import React, { useState, useRef, useEffect } from "react";
import "./EllipsisTextUptoTwo.css";
import LinesEllipsis from "react-lines-ellipsis";

const EllipsisTextUptoTwo = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(true);
  const tempRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (tempRef.current && containerRef.current && text) {
      // Clear any previous measurements
      containerRef.current.innerHTML = "";

      // Create a temporary span element to measure text
      const tempElement = document.createElement("span");
      tempElement.style.whiteSpace = "normal";
      tempElement.style.display = "inline";
      tempElement.style.visibility = "hidden";
      tempElement.innerHTML = text;
      containerRef.current.appendChild(tempElement);

      // Compare heights
      const needsTruncate =
        tempElement.offsetHeight > containerRef.current.offsetHeight;

      // Clean up
      containerRef.current.innerHTML = "";

      // Update state
      setNeedsTruncation(needsTruncate);
    }
  }, [text]);

  if (!text) {
    return null; // Render nothing if text is null or undefined
  }

  return (
    <div ref={containerRef}>
      {expanded || !needsTruncation ? (
        <>
          {text}
          {/* {needsTruncation && (
            <button
              onClick={() => setExpanded(false)}
              className="font-semibold text-slate-600 ps-14"
            >
              Show less
            </button>
          )} */}
        </>
      ) : (
        <>
          <LinesEllipsis
            text={text}
            maxLine={2}
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
          {needsTruncation && (
            <button
              onClick={() => setExpanded(true)}
              className="font-semibold text-slate-600 "
            >
              Show more
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EllipsisTextUptoTwo;
