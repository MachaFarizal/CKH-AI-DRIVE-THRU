import { VideoFrameExtractor } from './video/VideoFrameExtractor';
import { FrameProcessor } from './processing/FrameProcessor';
import { WorkerPool } from './WorkerPool';
import { ErrorHandler } from './ErrorHandler';
import { PerformanceMonitor } from './PerformanceMonitor';
import { ModelManager } from './models/ModelManager';
import type { VideoFrame } from './types';

export class VideoProcessor {
  private frameExtractor: VideoFrameExtractor;
  private frameProcessor: FrameProcessor;
  private isProcessing = false;
  private performanceMonitor = PerformanceMonitor.getInstance();
  private modelManager = ModelManager.getInstance();

  constructor(
    private videoElement: HTMLVideoElement,
    private onFrame?: (frame: VideoFrame) => void
  ) {
    this.frameExtractor = new VideoFrameExtractor(videoElement);
    this.frameProcessor = new FrameProcessor(
      new WorkerPool('/src/lib/videoAnalytics/workers/detection.worker.ts')
    );
  }

  async start() {
    try {
      // Initialize models first
      await this.modelManager.initialize();
      
      this.isProcessing = true;
      await this.frameExtractor.waitForVideo();
      this.processFrame();
    } catch (error) {
      console.error('Failed to start video processor:', error);
      throw error;
    }
  }

  stop() {
    this.isProcessing = false;
  }

  private async processFrame() {
    if (!this.isProcessing) return;

    const endMetrics = this.performanceMonitor.startOperation('frame_processing');

    try {
      const imageData = await this.frameExtractor.extractFrame();
      if (!imageData) {
        requestAnimationFrame(() => this.processFrame());
        return;
      }

      const frame = await this.frameProcessor.processFrame(imageData);
      
      if (this.onFrame) {
        this.onFrame(frame);
      }

      endMetrics();
    } catch (error) {
      console.error('Error processing frame:', error);
      endMetrics();
    }

    requestAnimationFrame(() => this.processFrame());
  }

  dispose() {
    this.stop();
    this.frameProcessor.dispose();
  }
}