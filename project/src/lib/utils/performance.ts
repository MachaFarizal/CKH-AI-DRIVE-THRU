export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

export class PerformanceMetrics {
  private static readonly MAX_HISTORY = 100;
  private metrics: Map<string, PerformanceMetric[]> = new Map();

  addMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metrics = this.metrics.get(name)!;
    metrics.push({
      name,
      value,
      timestamp: Date.now()
    });

    // Keep only recent history
    if (metrics.length > PerformanceMetrics.MAX_HISTORY) {
      metrics.shift();
    }
  }

  getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.get(name) || [];
  }

  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }
}