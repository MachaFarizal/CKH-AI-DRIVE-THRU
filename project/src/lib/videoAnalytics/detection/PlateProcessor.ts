import { PlateDetector } from './PlateDetector';
import { PlateOCR } from './PlateOCR';
import type { DetectedPlate } from '../types';

export class PlateProcessor {
  private detector: PlateDetector;
  private ocr: PlateOCR;

  constructor() {
    this.detector = PlateDetector.getInstance();
    this.ocr = PlateOCR.getInstance();
  }

  async process(imageData: ImageData): Promise<DetectedPlate[]> {
    // Detect plates
    const plates = await this.detector.detect(imageData);
    
    // Process each plate with OCR
    const processedPlates = await Promise.all(
      plates.map(async plate => {
        const plateImage = this.extractPlateImage(imageData, plate.bbox);
        if (plateImage) {
          const text = await this.ocr.recognize(plateImage);
          return { ...plate, plate: text };
        }
        return plate;
      })
    );

    return processedPlates;
  }

  private extractPlateImage(imageData: ImageData, bbox: number[]): ImageData | null {
    const [x, y, width, height] = bbox;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = width;
    canvas.height = height;
    
    const sourceCanvas = document.createElement('canvas');
    const sourceCtx = sourceCanvas.getContext('2d');
    if (!sourceCtx) return null;

    sourceCanvas.width = imageData.width;
    sourceCanvas.height = imageData.height;
    sourceCtx.putImageData(imageData, 0, 0);
    
    ctx.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);
    
    return ctx.getImageData(0, 0, width, height);
  }
}