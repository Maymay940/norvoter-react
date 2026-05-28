export const VideoBackground = () => {

  const isGitHubPages = window.location.hostname.includes('github.io');
  
  const videoSrc = isGitHubPages 
    ? '/videos/background.mp4'  // на GitHub Pages - видео из папки public
    : 'http://localhost:9002/meters/video/video_water.mp4';  // локально - MinIO

  return (
    <div className="video-background">
      <video autoPlay muted loop playsInline className="background-video">
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="video-overlay"></div>
    </div>
  );
};