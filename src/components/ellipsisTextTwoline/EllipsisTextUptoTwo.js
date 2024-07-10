import React, { useState, useRef, useEffect } from "react";
import "./EllipsisTextUptoTwo.css";
import LinesEllipsis from "react-lines-ellipsis";

const EllipsisTextUptoTwo = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef(null);
  const ellipsisRef = useRef(null);

  useEffect(() => {
    if (textRef.current && ellipsisRef.current && text) {
      // Compare the height of the full text and the truncated text
      setNeedsTruncation(
        textRef.current.clientHeight > ellipsisRef.current.clientHeight
      );
    }
  }, [text]);

  if (!text) {
    return null; // Render nothing if text is null or undefined
  }

  return (
    <div>
      {expanded || !needsTruncation ? (
        <div ref={textRef}>
          {text}
          {needsTruncation && (
            <button onClick={() => setExpanded(false)}>Show less</button>
          )}
        </div>
      ) : (
        <div ref={ellipsisRef}>
          <LinesEllipsis
            text={text}
            maxLine={2}
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
          {needsTruncation && (
            <button onClick={() => setExpanded(true)}>Show more</button>
          )}
        </div>
      )}
    </div>
  );
};

export default EllipsisTextUptoTwo;
