import { ModelLoader } from './ModelLoader';
import { ModelCache } from '../utils/ModelCache';
import { ErrorHandler } from '../ErrorHandler';

export class ModelInitializer {
  private static instance: ModelInitializer;
  private modelLoader: ModelLoader;
  private modelCache: ModelCache;
  private initializationStatus: Map<string, boolean> = new Map();
  private initializationPromise: Promise<void> | null = null;
  private maxRetries = 3;
  private retryDelay = 2000;

  private constructor() {
    this.modelLoader = ModelLoader.getInstance();
    this.modelCache = ModelCache.getInstance();
  }

  static getInstance(): ModelInitializer {
    if (!ModelInitializer.instance) {
      ModelInitializer.instance = new ModelInitializer();
    }
    return ModelInitializer.instance;
  }

  async initializeModels(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeModelsWithRetry();
    return this.initializationPromise;
  }

  private async initializeModelsWithRetry(retries = this.maxRetries): Promise<void> {
    try {
      // First try to load face models as they're more critical
      await this.loadFaceModels();
      
      // Then try to load plate models, but don't fail if they can't be loaded
      try {
        await this.loadPlateModel();
      } catch (error) {
        console.warn('Plate model loading failed, continuing with face detection only:', error);
        this.initializationStatus.set('plate', false);
      }

      // If at least face detection is working, consider initialization successful
      if (this.initializationStatus.get('face')) {
        return;
      }
      
      throw new Error('Critical models failed to initialize');
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.initializeModelsWithRetry(retries - 1);
      }
      
      this.initializationStatus.clear();
      this.initializationPromise = null;
      throw error;
    }
  }

  private async loadFaceModels(): Promise<void> {
    try {
      const success = await ErrorHandler.withRetry(
        () => this.modelLoader.loadFaceModels(),
        'face model loading',
        2
      );
      
      if (!success) {
        throw new Error('Face model loading returned false');
      }
      
      this.initializationStatus.set('face', true);
    } catch (error) {
      console.error('Face model loading failed:', error);
      this.initializationStatus.set('face', false);
      throw error;
    }
  }

  private async loadPlateModel(): Promise<void> {
    try {
      const model = await ErrorHandler.withRetry(
        () => this.modelLoader.loadPlateModel(),
        'plate model loading',
        2
      );
      
      if (!model) {
        throw new Error('Plate model loading returned null');
      }
      
      const isValid = await this.modelLoader.validateModel(model);
      if (!isValid) {
        throw new Error('Plate model validation failed');
      }
      
      await this.modelCache.setModel('plate_detector', model);
      this.initializationStatus.set('plate', true);
    } catch (error) {
      console.error('Plate model loading failed:', error);
      this.initializationStatus.set('plate', false);
      throw error;
    }
  }

  isModelInitialized(modelType: string): boolean {
    return this.initializationStatus.get(modelType) || false;
  }

  areAllModelsInitialized(): boolean {
    return this.isModelInitialized('face');
  }
}