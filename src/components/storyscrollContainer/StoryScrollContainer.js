import React, { useRef, useState, useEffect } from 'react';
import styles from './ScrollContainer.module.css'
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

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
                setShowRightButton(current.scrollLeft < (current.scrollWidth - current.clientWidth - 50));
            }
        };

        if (scrollRef.current) {
            scrollRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                scrollRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 500;
            if (direction === 'left') {
                current.scrollTo({
                    left: current.scrollLeft - scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                current.scrollTo({
                    left: current.scrollLeft + scrollAmount,
                    behavior: 'smooth'
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
        const walk = (x - startX);
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    var arrayOfObjects = [];

    for (var i = 0; i < 270; i++) {
        var newObj = {
            id: i,
            email: "Empty email " + i,
            name: "Empty name " + i
        }

        arrayOfObjects.push(newObj);
    }

    return (
        <div style={{ display: 'flex', gap: '15px', position: 'relative' }} className='p-3'>
            <div
                ref={scrollRef}
                className={styles.populerscroll}
                onMouseDown={startDragging}
                onMouseLeave={stopDragging}
                onMouseUp={stopDragging}
                onMouseMove={onDrag}
            >
                {showLeftButton && (
                    <button style={{ left: '10px' }} className={`${styles.scrollbtns} rounded-full border-2 uptotab bg-slate-500 `} onClick={() => scroll('left')}>
                        <ChevronLeftOutlinedIcon color='white' fontSize='large' />
                    </button>
                )}
                {arrayOfObjects.map((email, index) => {
                    return (
                        <div key={index} className='flex items-center justify-center rounded-full border' style={{ height: "70px", minWidth: "70px" }}>{index}</div>
                    );
                })}
                {showRightButton && (
                    <button style={{ right: '10px' }} className={`${styles.scrollbtns} rounded-full border-2 uptotab bg-slate-500 `} onClick={() => scroll('right')}>
                        <ChevronRightOutlinedIcon color='white' fontSize='large' />
                    </button>
                )}
            </div>
        </div >
    );
}

export default StoryScrollContainer;

