import { useEffect, useState } from "react";
import HlsPlayer from "../components/HlsPlayer";
import "../styles/dashboard.css";

export default function Dashboard() {
    const [isPaused, setIsPaused] = useState(false);

    const BASE = "https://videohoster.ziyadhali.space/hls";

    const streams = Array.from({ length: 6 }, (_, i) => ({
        name: `Camera ${i + 1}`,
        url: `${BASE}/cam${i + 1}/index.m3u8`
    }));

    useEffect(() => {
        const syncInterval = setInterval(() => {
            if (isPaused) return;

            const videos = document.querySelectorAll("video");
            if (videos.length < 2) return;

            const master = videos[0].currentTime;

            videos.forEach((v, index) => {
                if (index === 0) return;

                const diff = Math.abs(v.currentTime - master);

                if (diff > 0.4) {
                    v.currentTime = master;
                }
            });
        }, 500);

        return () => clearInterval(syncInterval);
    }, [isPaused]);

    const togglePauseResume = () => {
        const videos = document.querySelectorAll("video");

        if (!isPaused) {
            videos.forEach(v => v.pause());
            setIsPaused(true);
        } else {
            const masterTime = videos[0]?.currentTime || 0;

            videos.forEach(v => {
                v.currentTime = masterTime;
                v.play();
            });

            setIsPaused(false);
        }
    };

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Video Streaming Dashboard</h1>
            </header>

            <div className="controls">
                <button className="ctrl-btn" onClick={togglePauseResume}>
                    {isPaused ? "▶ Resume All" : "⏸ Pause All"}
                </button>
            </div>

            <div className="dashboard-grid">
                {streams.map((stream, i) => (
                    <div key={i} className="camera-card">
                        <div className="camera-title">{stream.name}</div>
                        <HlsPlayer src={stream.url} />
                    </div>
                ))}
            </div>
        </div>
    );
}
