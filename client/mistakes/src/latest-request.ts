export class LatestRequest {
  private version = 0;
  private controller: AbortController | null = null;

  cancel(): void {
    this.version += 1;
    this.controller?.abort();
    this.controller = null;
  }

  async run<T>(request: (signal: AbortSignal) => Promise<T>, callbacks: {
    start: () => void;
    success: (value: T) => void;
    error: (error: Error) => void;
    finish: () => void;
  }): Promise<void> {
    this.cancel();
    const version = this.version;
    const controller = new AbortController();
    this.controller = controller;
    const current = () => version === this.version && !controller.signal.aborted;
    callbacks.start();
    try {
      const value = await request(controller.signal);
      if (current()) callbacks.success(value);
    } catch (error) {
      if (current()) callbacks.error(error as Error);
    } finally {
      if (current()) {
        this.controller = null;
        callbacks.finish();
      }
    }
  }
}
