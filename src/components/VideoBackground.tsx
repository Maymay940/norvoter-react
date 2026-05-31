// src/components/VideoBackground.tsx
import { useState } from 'react';
import { getAssetPath } from '../utils/paths';

export const VideoBackground = () => {
  const [videoError, setVideoError] = useState(false);
  const isGitHubPages = window.location.hostname.includes('github.io');

  const videoSrc = isGitHubPages 
    ? getAssetPath('videos/background.mp4')
    : 'http://localhost:9002/meters/video/video_water.mp4';

  if (videoError) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0d6efd',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
    );
  }

  return (
    <div className="video-background">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="background-video"
        onError={() => setVideoError(true)}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="video-overlay"></div>
    </div>
  );
};
