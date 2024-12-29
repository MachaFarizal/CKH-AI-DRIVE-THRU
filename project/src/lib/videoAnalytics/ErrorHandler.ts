export class ErrorHandler {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // ms

  static async withRetry<T>(
    operation: () => Promise<T>,
    context: string,
    retries = this.MAX_RETRIES
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Error in ${context}, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        return this.withRetry(operation, context, retries - 1);
      }
      throw error;
    }
  }

  static async withGracefulDegradation<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      return await primaryOperation();
    } catch (error) {
      console.warn(`Error in ${context}, falling back to alternative method`);
      return fallbackOperation();
    }
  }

  static handleError(error: Error, context: string) {
    // Log error
    console.error(`Error in ${context}:`, error);

    // Report to monitoring service if needed
    // this.reportError(error, context);

    // Return user-friendly error message
    return {
      message: 'An error occurred while processing the video stream',
      details: error.message,
      context
    };
  }
}