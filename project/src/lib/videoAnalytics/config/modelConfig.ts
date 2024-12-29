export const MODEL_CONFIG = {
  face: {
    detector: {
      modelUrl: '/models/face_detector-tiny',
      minConfidence: 0.7,
      inputSize: 416,
      scoreThreshold: 0.5,
      maxDetections: 10
    }
  },
  plate: {
    detector: {
      modelUrl: '/models/alpr',
      minConfidence: 0.75,
      inputSize: [416, 416],
      iouThreshold: 0.5,
      maxDetections: 5
    },
    ocr: {
      modelUrl: '/models/alpr/ocr',
      charList: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      minConfidence: 0.8
    }
  }
};

export const VISUALIZATION_CONFIG = {
  face: {
    boxColor: 'rgba(0, 255, 0, 0.8)',
    textColor: 'rgba(255, 255, 255, 1)',
    textBackground: 'rgba(0, 255, 0, 0.6)',
    lineWidth: 2,
    fontSize: '12px Arial',
    padding: 4
  },
  plate: {
    boxColor: 'rgba(255, 0, 0, 0.8)',
    textColor: 'rgba(255, 255, 255, 1)',
    textBackground: 'rgba(255, 0, 0, 0.6)',
    lineWidth: 2,
    fontSize: '14px Arial',
    padding: 4
  }
};