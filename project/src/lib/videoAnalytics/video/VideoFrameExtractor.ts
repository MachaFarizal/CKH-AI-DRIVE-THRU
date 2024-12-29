export class VideoFrameExtractor {
  private lastFrameTime = 0;
  private readonly FRAME_INTERVAL = 1000 / 30; // 30 FPS

  constructor(private videoElement: HTMLVideoElement) {}

  async waitForVideo(): Promise<void> {
    if (this.videoElement.readyState >= 2) return;

    return new Promise((resolve) => {
      const handleLoaded = () => {
        this.videoElement.removeEventListener('loadeddata', handleLoaded);
        resolve();
      };
      this.videoElement.addEventListener('loadeddata', handleLoaded);
    });
  }

  async extractFrame(): Promise<ImageData | null> {
    const now = performance.now();
    if (now - this.lastFrameTime < this.FRAME_INTERVAL) {
      return null;
    }

    if (!this.videoElement.videoWidth || !this.videoElement.videoHeight) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.drawImage(this.videoElement, 0, 0);
    this.lastFrameTime = now;
    
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
}