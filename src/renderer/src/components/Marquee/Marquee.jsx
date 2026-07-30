import { useEffect, useRef, useState } from "react";
import "./Marquee.css";

function Marquee({ children, className }) {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [scroll, setScroll] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;

        const distance = text.scrollWidth - container.clientWidth

        if (distance > 0) {
            setScroll(true);

            const duration = distance / 10; // 30pix per second

            text.style.setProperty(
                "--scroll-distance",
                `-${distance}px`
            );

            text.style.setProperty(
                "--scroll-duration",
                `${duration}s`
            );
        } else {
            setScroll(false);
        }
    }, [children]);

    return (
        <div ref={containerRef} className={`marquee ${className}`}>
            <div
                ref={textRef}
                className={scroll ? "marquee-text scrolling" : "marquee-text"}
            >
                {children}
            </div>
        </div>
    );
}

export default Marquee;