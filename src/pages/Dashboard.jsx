import { useEffect } from "react";
import HlsPlayer from "../components/HlsPlayer";
import "../styles/dashboard.css";

export default function Dashboard() {
  const streams = [
    { name: "Camera 1", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
    { name: "Camera 2", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
    { name: "Camera 3", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
    { name: "Camera 4", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
    { name: "Camera 5", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
    { name: "Camera 6", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  ];

  // SYNC LOGIC
  useEffect(() => {
    const videos = document.querySelectorAll("video");

    videos.forEach((v) => v.pause());

    setTimeout(() => {
      videos.forEach((v) => {
        v.currentTime = 0;
        v.play();
      });
    }, 2000);

    const syncInterval = setInterval(() => {
      const vids = document.querySelectorAll("video");
      if (vids.length === 0) return;

      const master = vids[0].currentTime;

      vids.forEach((v) => {
        if (Math.abs(v.currentTime - master) > 0.4) {
          v.currentTime = master;
        }
      });
    }, 1000);

    return () => clearInterval(syncInterval);
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Video Streaming Dashboard</h1>
      </header>

      <div className="dashboard-grid">
        {streams.map((stream, i) => (
          <div key={i} className="camera-card">
            <div className="camera-title">{stream.name}</div>
            <div className="video-wrapper">
              <HlsPlayer src={stream.url} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
