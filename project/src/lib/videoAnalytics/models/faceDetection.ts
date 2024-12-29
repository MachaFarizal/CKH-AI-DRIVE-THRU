import * as faceapi from '@vladmandic/face-api';

export class FaceDetector {
  private static instance: FaceDetector;
  private initialized = false;

  private constructor() {}

  static getInstance(): FaceDetector {
    if (!FaceDetector.instance) {
      FaceDetector.instance = new FaceDetector();
    }
    return FaceDetector.instance;
  }

  async initialize() {
    if (this.initialized) return;

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]);

    this.initialized = true;
  }

  async detectFaces(input: HTMLCanvasElement | HTMLVideoElement) {
    if (!this.initialized) await this.initialize();

    const detections = await faceapi
      .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    return detections.map(detection => ({
      bbox: [
        detection.detection.box.x,
        detection.detection.box.y,
        detection.detection.box.width,
        detection.detection.box.height
      ] as [number, number, number, number],
      confidence: detection.detection.score,
      landmarks: detection.landmarks.positions.map(pos => [pos.x, pos.y])
    }));
  }
}