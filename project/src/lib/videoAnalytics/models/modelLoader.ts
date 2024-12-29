import * as tf from '@tensorflow/tfjs';

export class ModelLoader {
  private static instance: ModelLoader;
  private static modelsPath = '/models';
  private static modelFiles = {
    face: [
      'face_landmark_68.weights',
      'face_recognition.weights',
      'tiny_face_detector.weights'
    ],
    plate: [
      'ssd_mobilenetv1.weights'
    ]
  };

  private constructor() {}

  static getInstance(): ModelLoader {
    if (!ModelLoader.instance) {
      ModelLoader.instance = new ModelLoader();
    }
    return ModelLoader.instance;
  }

  private async downloadModels(modelType: 'face' | 'plate'): Promise<void> {
    try {
      const response = await fetch('/api/models-version');
      const { version } = await response.json();
      const localVersion = localStorage.getItem(`models-version-${modelType}`);

      if (localVersion === version) {
        console.log(`${modelType} models are up to date`);
        return;
      }

      const files = ModelLoader.modelFiles[modelType];
      await Promise.all(
        files.map(async (file) => {
          const response = await fetch(`${ModelLoader.modelsPath}/${file}`);
          const buffer = await response.arrayBuffer();
          const blob = new Blob([buffer]);
          
          // Store in IndexedDB for offline access
          await tf.io.browserFiles([blob], file);
        })
      );

      localStorage.setItem(`models-version-${modelType}`, version);
      console.log(`${modelType} models downloaded successfully`);
    } catch (error) {
      console.error(`Error downloading ${modelType} models:`, error);
      throw error;
    }
  }

  async loadFaceModels(): Promise<boolean> {
    try {
      await this.downloadModels('face');
      await tf.ready();
      
      // Load face detection models from IndexedDB
      for (const file of ModelLoader.modelFiles.face) {
        const model = await tf.loadGraphModel(
          tf.io.browserFiles([file])
        );
        await model.load();
      }
      
      return true;
    } catch (error) {
      console.error('Error loading face models:', error);
      return false;
    }
  }

  async loadPlateModel(): Promise<tf.GraphModel | null> {
    try {
      await this.downloadModels('plate');
      await tf.ready();
      
      // Load plate detection model from IndexedDB
      const modelFile = ModelLoader.modelFiles.plate[0];
      const model = await tf.loadGraphModel(
        tf.io.browserFiles([modelFile])
      );
      await model.load();
      
      return model;
    } catch (error) {
      console.error('Error loading plate model:', error);
      return null;
    }
  }

  async validateModel(model: tf.GraphModel): Promise<boolean> {
    try {
      // Basic validation - check if the model has layers
      if (!model.layers || model.layers.length === 0) {
        return false;
      }

      // Try to get input shape (this will throw if model is invalid)
      const inputShape = model.inputs[0].shape;
      if (!inputShape || inputShape.length === 0) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating model:', error);
      return false;
    }
  }
}