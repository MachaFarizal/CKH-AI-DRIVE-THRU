type Listener = (...args: any[]) => void;

export class EventEmitter {
  private events: Map<string, Set<Listener>> = new Map();

  on(event: string, listener: Listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(listener);
  }

  off(event: string, listener: Listener) {
    this.events.get(event)?.delete(listener);
  }

  emit(event: string, ...args: any[]) {
    this.events.get(event)?.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }
}