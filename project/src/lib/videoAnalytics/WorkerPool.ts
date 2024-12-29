export class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{
    task: any;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];
  private readonly maxWorkers = navigator.hardwareConcurrency || 4;

  constructor(private workerScript: string) {
    this.initialize();
  }

  private initialize() {
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = new Worker(this.workerScript, { type: 'module' });
      this.workers.push(worker);
    }
  }

  async executeTask(task: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find(
        worker => worker.onmessage === null
      );

      if (availableWorker) {
        this.runTask(availableWorker, task, resolve, reject);
      } else {
        this.queue.push({ task, resolve, reject });
      }
    });
  }

  private runTask(
    worker: Worker,
    task: any,
    resolve: (value: any) => void,
    reject: (reason?: any) => void
  ) {
    const handleMessage = (event: MessageEvent) => {
      worker.onmessage = null;
      worker.onerror = null;
      resolve(event.data);

      const nextTask = this.queue.shift();
      if (nextTask) {
        this.runTask(worker, nextTask.task, nextTask.resolve, nextTask.reject);
      }
    };

    const handleError = (error: ErrorEvent) => {
      worker.onmessage = null;
      worker.onerror = null;
      reject(error);

      const nextTask = this.queue.shift();
      if (nextTask) {
        this.runTask(worker, nextTask.task, nextTask.resolve, nextTask.reject);
      }
    };

    worker.onmessage = handleMessage;
    worker.onerror = handleError;
    worker.postMessage(task);
  }

  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.queue = [];
  }
}