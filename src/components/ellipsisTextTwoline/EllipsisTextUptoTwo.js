import React, { useState, useRef, useEffect } from "react";
import "./EllipsisTextUptoTwo.css";

const EllipsisTextUptoTwo = ({ text, color = "black" }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && text) {
      // Use a hidden div for measurement
      const hiddenDiv = document.createElement("div");
      hiddenDiv.style.position = "absolute";
      hiddenDiv.style.visibility = "hidden";
      hiddenDiv.style.whiteSpace = "normal";
      hiddenDiv.style.width = containerRef.current.offsetWidth + "px";
      hiddenDiv.innerHTML = text;
      document.body.appendChild(hiddenDiv);

      // Compare heights
      const needsTruncate =
        hiddenDiv.offsetHeight > containerRef.current.offsetHeight;

      // Clean up
      document.body.removeChild(hiddenDiv);

      // Update state
      setNeedsTruncation(needsTruncate);
    }
  }, [text]);

  if (!text) {
    return null; // Render nothing if text is null or undefined
  }

  return (
    <div ref={containerRef} style={{ minHeight: "30px", color: color }}>
      {expanded || !needsTruncation ? (
        <>
          {text}
          {needsTruncation && (
            <button
              onClick={() => setExpanded(false)}
              className="font-semibold text-slate-600 ps-14"
            >
              Show less
            </button>
          )}
        </>
      ) : (
        <>
          <div
            style={{
              color: color,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </div>
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
