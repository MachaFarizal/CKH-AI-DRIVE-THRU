export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startOperation(name: string) {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      this.metrics.get(name)!.push(duration);
      
      // Keep only last 100 measurements
      if (this.metrics.get(name)!.length > 100) {
        this.metrics.get(name)!.shift();
      }
    };
  }

  getMetrics(name: string) {
    return this.metrics.get(name) || [];
  }

  getAverageMetric(name: string) {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    return metrics.reduce((a, b) => a + b, 0) / metrics.length;
  }
}