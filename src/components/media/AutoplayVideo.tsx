import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';

type AutoplayVideoProps = ComponentPropsWithoutRef<'video'>;

export function AutoplayVideo({ className, style, ...props }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      void video.play().then(() => setIsPlaying(true)).catch(() => {});
    };
    const handlePlaying = () => setIsPlaying(true);

    tryPlay();
    video.addEventListener('canplay', tryPlay);
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('loadedmetadata', tryPlay);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('canplay', tryPlay);
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('loadedmetadata', tryPlay);
      video.removeEventListener('playing', handlePlaying);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      {...props}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      controls={false}
      controlsList="nodownload nofullscreen noremoteplayback"
      disableRemotePlayback
      className={`${className ?? ''} pointer-events-none transition-opacity duration-500`}
      style={{
        ...style,
        ...(!isPlaying ? { opacity: 0 } : {}),
      }}
    />
  );
}

export default AutoplayVideo;
