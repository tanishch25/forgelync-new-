import { useRef, useEffect } from 'react';

export function VideoScrub({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // We need to wait for metadata to know the duration
    const onLoadedMetadata = () => {
      // pause video so it doesn't play automatically
      video.pause();
    };
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    let animationFrameId: number;
    // We smooth the current time using a simple lerp
    let targetTime = 0;
    let currentTime = 0;

    const renderLoop = () => {
      if (video.duration) {
        // Calculate scroll progress (0 to 1)
        const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
        const scrollProgress = window.scrollY / maxScroll;
        
        targetTime = scrollProgress * video.duration;
        // Lerp for ultra buttery smooth scrubbing (was 0.1)
        currentTime += (targetTime - currentTime) * 0.03;
        
        // Update video frame
        video.currentTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    
    renderLoop();

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      cancelAnimationFrame(animationFrameId);
    };
  }, [src]);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full h-screen z-0 bg-[#F5F5F7] overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover opacity-80"
        preload="auto"
        muted
        playsInline
      />
      {/* Light gradient overlay to ensure text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F7]/40 via-transparent to-[#F5F5F7]/90 mix-blend-multiply pointer-events-none" />
    </div>
  );
}
