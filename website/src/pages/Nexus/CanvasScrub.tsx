import { useRef, useEffect } from 'react';
import type { RefObject } from 'react';

export function CanvasScrub({ 
  frameCount = 147, 
  startFrameOffset = 0,
  urlPrefix = "",
  targetRef
}: { 
  frameCount?: number, 
  startFrameOffset?: number,
  urlPrefix?: string,
  targetRef?: RefObject<HTMLElement | HTMLDivElement | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: disable alpha
    if (!ctx) return;

    const loadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        // Add the offset to skip the intro frames
        const actualFrame = i + startFrameOffset;
        const frameIndex = actualFrame.toString().padStart(4, '0');
        img.src = urlPrefix ? `${urlPrefix}${frameIndex}.jpg` : `/frames/${frameIndex}.jpg`;
        imagesRef.current.push(img);
      }
    };
    loadImages();

    if (imagesRef.current[0]) {
      imagesRef.current[0].onload = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawImageToCover(ctx, imagesRef.current[0], canvas.width, canvas.height);
      };
    }

    let animationFrameId: number;
    let targetFrame = 0;

    const renderLoop = () => {
      const scrollContainer = targetRef?.current;
      let scrollProgress = 0;

      if (scrollContainer) {
        const rect = scrollContainer.getBoundingClientRect();
        const scrollY = -rect.top;
        const maxScroll = scrollContainer.offsetHeight - window.innerHeight;
        scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
      } else {
        const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
        scrollProgress = window.scrollY / maxScroll;
      }
      
      // Map progress to frame index
      targetFrame = scrollProgress * (frameCount - 1);
      
      // Direct assignment instead of interpolation. 
      // Lenis already handles the smoothing! Interpolating twice causes lag.
      const frameIndex = Math.floor(targetFrame);
      const img = imagesRef.current[frameIndex];
      
      if (img && img.complete && canvas.width > 0) {
        drawImageToCover(ctx, img, canvas.width, canvas.height);
      }
      
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    
    // Handle resizing
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [frameCount, urlPrefix]);

  // Helper to draw image like background-size: cover
  function drawImageToCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvasWidth: number, canvasHeight: number) {
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  return (
    <div className="w-full h-full bg-black overflow-hidden pointer-events-none relative">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      {/* Light gradient overlay to ensure text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />
    </div>
  );
}
