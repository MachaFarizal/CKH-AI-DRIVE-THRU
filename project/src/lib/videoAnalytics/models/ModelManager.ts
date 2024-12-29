import * as tf from '@tensorflow/tfjs';
import { ModelInitializer } from './ModelInitializer';
import { ModelCache } from '../utils/ModelCache';

export class ModelManager {
  private static instance: ModelManager;
  private modelInitializer: ModelInitializer;
  private modelCache: ModelCache;
  private initialized = false;

  private constructor() {
    this.modelInitializer = ModelInitializer.getInstance();
    this.modelCache = ModelCache.getInstance();
  }

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await tf.ready();
      await this.modelInitializer.initializeModels();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize models:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.initialized && this.modelInitializer.areAllModelsInitialized();
  }

  async getModel(modelName: string) {
    if (!this.initialized) {
      throw new Error('ModelManager not initialized');
    }
    return this.modelCache.getModel(modelName);
  }
}