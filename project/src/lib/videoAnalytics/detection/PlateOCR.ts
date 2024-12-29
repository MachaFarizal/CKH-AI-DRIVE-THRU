import * as tf from '@tensorflow/tfjs';
import { MODEL_CONFIG } from '../config/modelConfig';

export class PlateOCR {
  private static instance: PlateOCR;
  private model: tf.GraphModel | null = null;
  private initialized = false;
  private readonly charList = MODEL_CONFIG.plate.ocr.charList;

  private constructor() {}

  static getInstance(): PlateOCR {
    if (!PlateOCR.instance) {
      PlateOCR.instance = new PlateOCR();
    }
    return PlateOCR.instance;
  }

  async initialize(model: tf.GraphModel) {
    this.model = model;
    this.initialized = true;
  }

  async recognize(plateImage: ImageData): Promise<string> {
    if (!this.initialized || !this.model) {
      throw new Error('OCR model not initialized');
    }

    const tensor = tf.tidy(() => {
      return tf.browser.fromPixels(plateImage)
        .resizeBilinear([64, 256])
        .expandDims(0)
        .div(255.0);
    });

    try {
      const prediction = await this.model.predict(tensor) as tf.Tensor;
      const probabilities = await prediction.array();
      return this.decodeCTC(probabilities[0]);
    } finally {
      tensor.dispose();
    }
  }

  private decodeCTC(probabilities: number[][]): string {
    let result = '';
    let lastChar = '';

    for (const timeStep of probabilities) {
      const maxIndex = timeStep.indexOf(Math.max(...timeStep));
      const char = this.charList[maxIndex];
      
      if (char !== lastChar && char !== '') {
        result += char;
      }
      lastChar = char;
    }

    return result;
  }
}