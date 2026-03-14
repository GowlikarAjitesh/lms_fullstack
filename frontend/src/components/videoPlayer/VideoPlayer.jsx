import React, { useState, useRef, useEffect } from "react";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

export default function VideoPlayer({ url, onProgressUpdate, onProgressData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = video.currentTime / video.duration; // value between 0 and 1
    setProgress((prev) => Math.max(prev, percent));

    // console.log("Video progress:", percent);
  };

  useEffect(() => {
    if (progress >= 0.9) {
      onProgressUpdate({ ...onProgressData, progressValue: progress });
    }
  }, [progress]);

  return (
    <div
      className="w-full max-w-full rounded-xl overflow-hidden shadow-lg bg-background border border-border flex justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MediaController
        className="w-full h-full relative"
        style={{
          aspectRatio: "16 / 9",
          backgroundColor: "black",
        }}
      >
        <video
          ref={videoRef}
          slot="media"
          src={url}
          preload="metadata"
          crossOrigin="anonymous"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-contain"
        />

        {/* ✅ Always Visible Big Center Button */}
        <MediaPlayButton
          slot="centered-chrome"
          style={{
            width: "80px",
            height: "80px",
            "--media-control-background": "rgba(0,0,0,0.6)",
            "--media-control-hover-background": "rgba(0,0,0,0.8)",
            borderRadius: "50%",
            color: "white",
          }}
        />

        {/* ✅ Controls Visible ONLY when Playing + Hover */}
        {isPlaying && isHovered && (
          <MediaControlBar
            className="
              absolute bottom-0 left-0 right-0
              flex gap-2 items-center justify-around
              bg-gradient-to-t from-black/80 to-transparent
              p-2
              transition-opacity duration-300
            "
          >
            <MediaSeekBackwardButton
              seekOffset={10}
              className="bg-transparent"
            />{" "}
            <MediaPlayButton className="bg-transparent" />{" "}
            <MediaSeekForwardButton
              seekOffset={10}
              className="bg-transparent"
            />{" "}
            <MediaTimeDisplay
              showDuration
              className="text-foreground text-xs bg-transparent"
            />{" "}
            <MediaTimeRange className="bg-transparent" />{" "}
            <MediaMuteButton className="bg-transparent" />{" "}
            <MediaVolumeRange className="bg-transparent" />{" "}
            <MediaPlaybackRateButton className="bg-transparent" />{" "}
            <MediaFullscreenButton className="bg-transparent" />{" "}
          </MediaControlBar>
        )}
      </MediaController>
    </div>
  );
}
