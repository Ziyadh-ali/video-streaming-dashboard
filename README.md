# 📡 Video Streaming Dashboard (React + HLS + MediaMTX)

A real-time synchronized multi-camera video monitoring dashboard built using **React**, **HLS.js**, and **MediaMTX**.

---

## ⭐️ Features

- **6 simultaneous video streams** in a responsive grid (3×2)
- RTSP → HLS stream conversion using MediaMTX
- **5–6 distinct HLS URLs** simulated from the same RTSP source
- **Video sync engine** to keep all streams aligned
- HLS player with loader state & error handling
- Fullscreen mode
- **Camera name labels** & clean UI

---

## 🟦 RTSP → HLS Conversion Pipeline

Given RTSP source:

```
rtsp://13.60.76.79:8554/live
```

Browsers can't play RTSP directly, so **RTSP → HLS** conversion is necessary.  
This is done using **MediaMTX** (previously rtsp-simple-server).

### ✔ Why HLS?
- Supported by browsers:
  - .m3u8 playlists
  - Adaptive bitrate, buffer-based streaming
- Works with video players in React

---

## 🟩 Tools Used for Conversion
### **MediaMTX**
- Receives RTSP input
- Converts to HLS output
- Serves `.m3u8` files over HTTP

**Why MediaMTX?**
- No coding required
- Single executable
- Auto-converts RTSP → HLS
- Supports multiple “paths” (simulate multiple cameras)

---

## 🟧 Creating 6 Distinct HLS URLs

Simulate 6 different camera feeds from one RTSP source via multiple paths in `mediamtx.yml`:

```yaml
paths:
  stream1:
    source: rtsp://13.60.76.79:8554/live
  stream2:
    source: rtsp://13.60.76.79:8554/live
  stream3:
    source: rtsp://13.60.76.79:8554/live
  stream4:
    source: rtsp://13.60.76.79:8554/live
  stream5:
    source: rtsp://13.60.76.79:8554/live
  stream6:
    source: rtsp://13.60.76.79:8554/live
```

### Output HLS URLs:
```
http://localhost:8888/stream1/index.m3u8
http://localhost:8888/stream2/index.m3u8
http://localhost:8888/stream3/index.m3u8
http://localhost:8888/stream4/index.m3u8
http://localhost:8888/stream5/index.m3u8
http://localhost:8888/stream6/index.m3u8
```

---

## 🟦 MediaMTX Setup (Backend)

### 1. Download MediaMTX

- Download Windows binary: [MediaMTX Releases](https://github.com/bluenviron/mediamtx/releases/latest)
- Extract anywhere (e.g., Desktop)

### 2. Edit `mediamtx.yml`

Replace the `paths:` section as above.

### 3. Start the Server

```
./mediamtx.exe
```

If the RTSP source is available, HLS URLs become playable instantly.

---

## 🟪 React Frontend Setup (Dashboard)

1. **Install dependencies**:
    ```
    npm install
    ```
2. **Start development server**:
    ```
    npm run dev
    ```

- Dashboard available at: [http://localhost:5173/](http://localhost:5173/)

---

## 🟨 React Architecture

```
src/
 ├── components/
 │     └── HlsPlayer.jsx     # HLS video player using hls.js
 ├── pages/
 │     └── Dashboard.jsx     # Multi-camera dashboard
 ├── styles/
 │     └── dashboard.css     # UI styling
 ├── App.jsx
 └── main.jsx
```

---

## 🟦 Synchronization Logic

**Goal:** All videos must play in sync.

**Approach:**
- Pause all videos initially
- After 2s, force all videos to start from time 0
- Every 1s, compare timestamps
- If difference > 0.4s, adjust `currentTime`

```js
useEffect(() => {
  const videos = document.querySelectorAll("video");

  videos.forEach(v => v.pause());

  setTimeout(() => {
    videos.forEach(v => {
      v.currentTime = 0;
      v.play();
    });
  }, 2000);

  const syncInterval = setInterval(() => {
    const vids = document.querySelectorAll("video");
    if (vids.length === 0) return;

    const master = vids[0].currentTime;

    vids.forEach(v => {
      if (Math.abs(v.currentTime - master) > 0.4) {
        v.currentTime = master;
      }
    });
  }, 1000);

  return () => clearInterval(syncInterval);
}, []);
```

**Why This Works:**
- First video is the master timestamp
- Others adjust to match
- Pure client-side sync (no backend)
- Smooth for HLS

---

## 🟩 HLS Player Component

**Location:** `src/components/HlsPlayer.jsx`

- Uses hls.js for `.m3u8` playlists
- Loader indicators
- Auto-reconnect & error handling
- Fullscreen mode
- Timestamp overlay

---

## 🟦 Running the Full System

1. **Start MediaMTX**
    ```
    ./mediamtx.exe
    ```

2. **Confirm HLS URLs**

    Open in browser:

    ```
    http://localhost:8888/stream1/index.m3u8
    ```

    You should see an `.m3u8` playlist.

3. **Start React**
    ```
    npm run dev
    ```

    - Dashboard loads 6 synced HLS streams

---

## 🟧 Deployment (Optional)

You can deploy on:

- Vercel
- Netlify
- Render
- AWS Amplify

**Make sure:**
- MediaMTX server is running on a public IP
- CORS enabled
- HLS URLs publicly accessible

---

## 📜 License

MIT

---

## 📲 Links

- [MediaMTX GitHub](https://github.com/bluenviron/mediamtx)
- [React](https://react.dev/)
- [HLS.js](https://github.com/video-dev/hls.js/)
