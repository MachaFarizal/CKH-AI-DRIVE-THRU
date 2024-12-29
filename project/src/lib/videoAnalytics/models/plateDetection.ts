import * as tf from '@tensorflow/tfjs';
import { DetectedPlate } from '../types';

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

  async initialize() {
    if (this.initialized) return;

    try {
      // Load ALPR model
      this.model = await tf.loadGraphModel('/models/alpr/model.json');
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize plate detector:', error);
      throw error;
    }
  }

  async detectPlate(imageData: ImageData): Promise<DetectedPlate[]> {
    if (!this.initialized || !this.model) {
      throw new Error('Plate detector not initialized');
    }

    try {
      // Convert ImageData to tensor
      const tensor = tf.browser.fromPixels(imageData)
        .expandDims(0)
        .div(255.0);

      // Run inference
      const predictions = await this.model.predict(tensor) as tf.Tensor;
      const [boxes, scores, classes] = await Promise.all([
        predictions[0].array(),
        predictions[1].array(),
        predictions[2].array()
      ]);

      // Cleanup
      tensor.dispose();
      predictions.dispose();

      // Process results
      return this.processDetections(boxes[0], scores[0]);
    } catch (error) {
      console.error('Error detecting license plate:', error);
      return [];
    }
  }

  private processDetections(boxes: number[][], scores: number[]): DetectedPlate[] {
    const plates: DetectedPlate[] = [];
    const threshold = 0.5;

    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > threshold) {
        const [y1, x1, y2, x2] = boxes[i];
        plates.push({
          bbox: [x1, y1, x2 - x1, y2 - y1],
          confidence: scores[i],
          plate: '' // Plate text will be extracted in OCR step
        });
      }
    }

    return plates;
  }
}