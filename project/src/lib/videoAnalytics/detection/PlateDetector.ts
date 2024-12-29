import * as tf from '@tensorflow/tfjs';
import { MODEL_CONFIG } from '../config/modelConfig';
import type { DetectedPlate } from '../types';

export class PlateDetector {
  private static instance: PlateDetector;
  private model: tf.GraphModel | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): PlateDetector {
    if (!PlateDetector.instance) {
      PlateDetector.instance = new PlateDetector();
    }
    return PlateDetector.instance;
  }

  async initialize(model: tf.GraphModel) {
    this.model = model;
    this.initialized = true;
  }

  async detect(imageData: ImageData): Promise<DetectedPlate[]> {
    if (!this.initialized || !this.model) {
      throw new Error('Plate detector not initialized');
    }

    const tensor = tf.tidy(() => {
      return tf.browser.fromPixels(imageData)
        .resizeBilinear(MODEL_CONFIG.plate.detector.inputSize)
        .expandDims(0)
        .div(255.0);
    });

    try {
      const predictions = await this.model.executeAsync(tensor) as tf.Tensor[];
      const [boxes, scores] = await Promise.all([
        predictions[0].array(),
        predictions[1].array()
      ]);

      return this.processDetections(boxes[0], scores[0]);
    } finally {
      tensor.dispose();
      predictions?.forEach(t => t.dispose());
    }
  }

  private processDetections(boxes: number[][], scores: number[]): DetectedPlate[] {
    const plates: DetectedPlate[] = [];
    const threshold = MODEL_CONFIG.plate.detector.minConfidence;

    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > threshold) {
        const [y1, x1, y2, x2] = boxes[i];
        plates.push({
          bbox: [x1, y1, x2 - x1, y2 - y1],
          confidence: scores[i],
          plate: ''
        });
      }
    }

    return plates;
  }
}