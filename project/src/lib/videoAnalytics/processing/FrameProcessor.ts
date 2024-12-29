import { ErrorHandler } from '../ErrorHandler';
import { WorkerPool } from '../WorkerPool';
import { PlateProcessor } from '../detection/PlateProcessor';
import type { VideoFrame, DetectedFace, DetectedPlate } from '../types';

export class FrameProcessor {
  private plateProcessor: PlateProcessor;

  constructor(private workerPool: WorkerPool) {
    this.plateProcessor = new PlateProcessor();
  }

  async processFrame(imageData: ImageData): Promise<VideoFrame> {
    const [faceResult, plateResult] = await Promise.all([
      ErrorHandler.withRetry(
        () => this.detectObjects(imageData, 'face_detector'),
        'face detection'
      ),
      ErrorHandler.withRetry(
        () => this.plateProcessor.process(imageData),
        'plate detection'
      )
    ]);

    return {
      timestamp: Date.now(),
      faces: this.processFaceDetections(faceResult?.predictions || []),
      plates: plateResult || []
    };
  }

  private async detectObjects(imageData: ImageData, modelName: string) {
    return this.workerPool.executeTask({
      type: 'detect',
      data: { imageData, modelName }
    });
  }

  private processFaceDetections(predictions: any[]): DetectedFace[] {
    if (!Array.isArray(predictions)) return [];
    
    return predictions.map(pred => ({
      bbox: pred.bbox,
      confidence: pred.confidence,
      landmarks: pred.landmarks
    }));
  }

  dispose() {
    this.workerPool.terminate();
  }
}