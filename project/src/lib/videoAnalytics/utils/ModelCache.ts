import * as tf from '@tensorflow/tfjs';

export class ModelCache {
  private static instance: ModelCache;
  private cache: Map<string, tf.LayersModel | tf.GraphModel> = new Map();
  
  static getInstance(): ModelCache {
    if (!ModelCache.instance) {
      ModelCache.instance = new ModelCache();
    }
    return ModelCache.instance;
  }

  async getModel(key: string): Promise<tf.LayersModel | tf.GraphModel | null> {
    return this.cache.get(key) || null;
  }

  async setModel(key: string, model: tf.LayersModel | tf.GraphModel): Promise<void> {
    if (this.cache.has(key)) {
      const oldModel = this.cache.get(key);
      if (oldModel) {
        oldModel.dispose();
      }
    }
    this.cache.set(key, model);
  }

  async clearCache(): Promise<void> {
    for (const model of this.cache.values()) {
      model.dispose();
    }
    this.cache.clear();
  }
}