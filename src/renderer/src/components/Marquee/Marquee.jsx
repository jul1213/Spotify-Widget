import { useEffect, useRef, useState } from "react";
import "./Marquee.css";

const PAUSE_MS = 3000;
const PIXELS_PER_SEC = 40;

function Marquee({ children, className }) {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const lastTextRef = useRef(null);

    const [translateX, setTranslateX] = useState(0);
    const [transitionDuration, setTransitionDuration] = useState(0);
    const [scroll, setScroll] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;
        const currentText = text.textContent;

        // only reset if the visible text actually changed
        if (currentText === lastTextRef.current) return;
        lastTextRef.current = currentText;

        const distance = text.scrollWidth - container.clientWidth

        // reset to start whenever the track changes
        setTranslateX(0);
        setTransitionDuration(0);

        if (distance > 5) {
            setScroll(true);
        } else {
            setScroll(false);
        }
    }, [children]);

    useEffect(() => {
        if (!scroll) return;

        let cancelled = false;
        const timeouts = [];
        const wait = (ms) =>
            new Promise((resolve) => {
                const id = setTimeout(resolve, ms);
                timeouts.push(id)
            });

        async function loop() {
            const container = containerRef.current;
            const text = textRef.current;

            while (!cancelled) {
                const distance = text.scrollWidth - container.clientWidth;
                const scrollDuration = distance / PIXELS_PER_SEC; // seconds

                // pause at start
                setTransitionDuration(0);
                setTranslateX(0);
                await wait(PAUSE_MS);
                if (cancelled) break;

                // scroll to end
                setTransitionDuration(scrollDuration);
                setTranslateX(-distance);
                await wait(scrollDuration * 1000);
                if (cancelled) break;

                // pause at end
                await wait(PAUSE_MS);
                if (cancelled) break;

                // scroll back to start
                setTransitionDuration(scrollDuration);
                setTranslateX(0);
                await wait(scrollDuration * 1000);
                if (cancelled) break;
            }
        }

        loop();

        return () => {
            cancelled = true;
            timeouts.forEach(clearTimeout);
        };
    }, [scroll, children])

    return (
        <div ref={containerRef} className={`marquee ${className}`}>
            <div
                ref={textRef}
                className="marquee-text"
                style={{
                    transform: `translateX(${translateX}px)`,
                    transitionProperty: "transform",
                    transitionDuration: `${transitionDuration}s`,
                    transitionTimingFunction: "linear",
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default Marquee;