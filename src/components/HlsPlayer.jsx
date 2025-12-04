import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function HlsPlayer({ src }) {
    const videoRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        let hls;

        // If browser supports HLS natively (Safari)
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else {
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {});
            });

            hls.on(Hls.Events.ERROR, () => {
                setLoading(false);
            });
        }

        video.onloadeddata = () => setLoading(false);
        video.onerror = () => setLoading(false);

        return () => {
            if (hls) hls.destroy();
        };
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
        </div>
    );
}
