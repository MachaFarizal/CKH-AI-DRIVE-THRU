export interface DetectedFace {
  id?: string;
  bbox: [number, number, number, number]; // [x, y, width, height]
  confidence: number;
  landmarks?: number[][];
}

export interface DetectedPlate {
  plate: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export interface VideoFrame {
  timestamp: number;
  faces: DetectedFace[];
  plates: DetectedPlate[];
}