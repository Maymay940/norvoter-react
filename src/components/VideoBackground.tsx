export const VideoBackground = () => {
  return (
    <div className="video-background">
      <video autoPlay muted loop playsInline className="background-video">
        <source src="http://localhost:9002/meters/video/video_water.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay"></div>
    </div>
  );
};