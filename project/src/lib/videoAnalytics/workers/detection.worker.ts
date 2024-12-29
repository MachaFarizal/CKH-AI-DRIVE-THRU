import * as tf from '@tensorflow/tfjs';
import * as faceapi from '@vladmandic/face-api';
import { ModelManager } from '../models/ModelManager';

let modelManager: ModelManager;

async function detectFaces(imageData: ImageData) {
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  ctx.putImageData(imageData, 0, 0);
  
  const detections = await faceapi
    .detectAllFaces(canvas as any, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks();

  return detections.map(detection => ({
    bbox: [
      detection.detection.box.x,
      detection.detection.box.y,
      detection.detection.box.width,
      detection.detection.box.height
    ],
    confidence: detection.detection.score,
    landmarks: detection.landmarks.positions.map(pos => [pos.x, pos.y])
  }));
}

async function detectPlates(imageData: ImageData) {
  const model = await modelManager.getModel('plate_detector');
  if (!model || !('predict' in model)) {
    throw new Error('Plate detection model not loaded');
  }

  const tensor = tf.browser.fromPixels(imageData)
    .expandDims(0)
    .div(255.0);

  const predictions = await (model as tf.GraphModel).predict(tensor) as tf.Tensor;
  const [boxes, scores] = await Promise.all([
    predictions[0].array(),
    predictions[1].array()
  ]);

  tensor.dispose();
  predictions.dispose();

  return boxes[0].map((box: number[], i: number) => ({
    bbox: box,
    confidence: scores[0][i],
    plate: '' // OCR would be done in a separate step
  }));
}

self.onmessage = async (e: MessageEvent) => {
  const { type, data } = e.data;

  try {
    switch (type) {
      case 'init':
        modelManager = ModelManager.getInstance();
        await modelManager.initialize();
        self.postMessage({ type: 'initialized' });
        break;

      case 'detect':
        const { imageData, modelName } = data;
        const predictions = modelName === 'face_detector' 
          ? await detectFaces(imageData)
          : await detectPlates(imageData);

        self.postMessage({
          type: 'result',
          data: { predictions, modelName }
        });
        break;
    }
  } catch (error: any) {
    self.postMessage({
      type: 'error',
      error: error.message
    });
  }
};