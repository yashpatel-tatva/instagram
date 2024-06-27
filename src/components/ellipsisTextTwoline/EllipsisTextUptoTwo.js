import React, { useState, useRef, useEffect } from 'react';
import './EllipsisTextUptoTwo.css'

const EllipsisTextUptoTwo = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container.scrollHeight > container.clientHeight) {
            container.style.webkitLineClamp = '2'; // Limit to 2 lines
        }
    }, []);

    const handleExpandClick = () => {
        setIsExpanded(true);
    };

    return (
        <span className="ellipsis-container" ref={containerRef}>
            <span className={`ellipsis-text ${isExpanded ? 'expanded' : ''}`}>{text}</span>
            {!isExpanded && (
                <span role='button' className="expand-button text-slate-400" onClick={handleExpandClick}>
                    more
                </span>
            )}
        </span>
    );
};

export default EllipsisTextUptoTwo;
