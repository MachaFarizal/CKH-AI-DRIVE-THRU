import React, { useEffect, useRef } from 'react';
import { VideoProcessor } from '../../lib/videoAnalytics/VideoProcessor';
import { DetectionRenderer } from '../../lib/videoAnalytics/visualization/DetectionRenderer';
import type { VideoFrame } from '../../lib/videoAnalytics/types';

interface DetectionOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ videoRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processorRef = useRef<VideoProcessor | null>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderer = new DetectionRenderer(ctx);
    const processor = new VideoProcessor(videoRef.current, (frame: VideoFrame) => {
      renderer.clear();
      frame.faces.forEach(face => renderer.drawFaceDetection(face));
      frame.plates.forEach(plate => renderer.drawPlateDetection(plate));
    });

    processorRef.current = processor;
    processor.start();

    return () => {
      processor.dispose();
    };
  }, [videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default DetectionOverlay;