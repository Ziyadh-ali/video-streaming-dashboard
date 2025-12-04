import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "../styles/dashboard.css";

function HlsPlayer({ src }) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls;

        const handlePlaying = () => setLoading(false);
        const handleWaiting = () => setLoading(true);

        video.addEventListener("playing", handlePlaying);
        video.addEventListener("waiting", handleWaiting);

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        }

        return () => {
            video.removeEventListener("playing", handlePlaying);
            video.removeEventListener("waiting", handleWaiting);
            if (hls) hls.destroy();
        };
    }, [src]);

    const goFullScreen = () => {
        const container = containerRef.current;
        if (!document.fullscreenElement) container.requestFullscreen();
        else document.exitFullscreen();
    };

    return (
        <div className="video-wrapper" ref={containerRef}>
            {loading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}

            <button className="fullscreen-btn" onClick={goFullScreen}>⛶</button>

            <video
                ref={videoRef} 
                muted 
                autoPlay 
                className="video-element" 
            />
        </div>
    );
}

export default HlsPlayer;
