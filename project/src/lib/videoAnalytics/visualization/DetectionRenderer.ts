import { DetectedFace, DetectedPlate } from '../types';
import { VISUALIZATION_CONFIG } from '../config/modelConfig';

export class DetectionRenderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  drawFaceDetection(face: DetectedFace) {
    const config = VISUALIZATION_CONFIG.face;
    const [x, y, width, height] = face.bbox;
    
    // Draw bounding box
    this.ctx.strokeStyle = config.boxColor;
    this.ctx.lineWidth = config.lineWidth;
    this.ctx.strokeRect(x, y, width, height);

    // Draw confidence score with background
    const text = `Face ${Math.round(face.confidence * 100)}%`;
    this.ctx.font = config.fontSize;
    const textWidth = this.ctx.measureText(text).width;
    
    this.ctx.fillStyle = config.textBackground;
    this.ctx.fillRect(
      x, 
      y - 20, 
      textWidth + config.padding * 2, 
      20
    );
    
    this.ctx.fillStyle = config.textColor;
    this.ctx.fillText(text, x + config.padding, y - 6);

    // Draw landmarks if available
    if (face.landmarks) {
      this.ctx.fillStyle = config.boxColor;
      face.landmarks.forEach(([lx, ly]) => {
        this.ctx.beginPath();
        this.ctx.arc(lx, ly, 2, 0, 2 * Math.PI);
        this.ctx.fill();
      });
    }
  }

  drawPlateDetection(plate: DetectedPlate) {
    const config = VISUALIZATION_CONFIG.plate;
    const [x, y, width, height] = plate.bbox;
    
    // Draw bounding box
    this.ctx.strokeStyle = config.boxColor;
    this.ctx.lineWidth = config.lineWidth;
    this.ctx.strokeRect(x, y, width, height);

    // Draw plate number and confidence with background
    const text = plate.plate ? 
      `${plate.plate} (${Math.round(plate.confidence * 100)}%)` :
      `Plate ${Math.round(plate.confidence * 100)}%`;
    
    this.ctx.font = config.fontSize;
    const textWidth = this.ctx.measureText(text).width;
    
    this.ctx.fillStyle = config.textBackground;
    this.ctx.fillRect(
      x, 
      y - 24, 
      textWidth + config.padding * 2, 
      24
    );
    
    this.ctx.fillStyle = config.textColor;
    this.ctx.fillText(text, x + config.padding, y - 8);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}