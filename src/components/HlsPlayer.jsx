import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function HlsPlayer({ src }) {
    const videoRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const enterFullscreen = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
        else if (video.mozRequestFullScreen) video.mozRequestFullScreen();
        else if (video.msRequestFullscreen) video.msRequestFullscreen();
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else {
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {});
            });

            hls.on(Hls.Events.ERROR, () => setLoading(false));
        }

        video.onloadeddata = () => setLoading(false);
        video.onerror = () => setLoading(false);

        return () => hls && hls.destroy();
    }, [src]);

    return (
        <div className="video-wrapper">
            {loading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}

            <video
                ref={videoRef}
                autoPlay
                muted
                controls={false}
                className="video-element"
            />

            <button className="fullscreen-btn" onClick={enterFullscreen}>
                ⤢
            </button>
        </div>
    );
}
