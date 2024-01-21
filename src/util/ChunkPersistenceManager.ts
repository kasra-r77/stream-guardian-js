// @ts-expect-error
import ChunkWorker from "../worker/chunkWorker?worker&inline";

export default class ChunkPersistenceManager {
  private recordingName: string;
  private worker: Worker;
  private chunksSent = 0;
  private chunksProcessed = 0;

  constructor() {
    this.recordingName = this.getCurrentTimestampForFileName();

    this.worker = new ChunkWorker();

    this.worker.onmessage = this.handleWorkerMessage;
    this.worker.onerror = this.handleWorkerError;
  }

  private getCurrentTimestampForFileName() {
    const now = new Date();

    // Format date and time in 'YYYY-MM-DD_HH-MM-SS' format
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // months are zero-indexed
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

  // Method to handle messages from the worker
  private handleWorkerMessage = (event: MessageEvent) => {
    // Handle messages from the worker
    if (event.data === "Chunk processed successfully.") {
      this.chunksProcessed++;
    }
  };

  private handleWorkerError = (error: ErrorEvent) => {
    console.error("Error in worker:", error.message);
  };

  // Send chunk data to the worker for processing
  processChunk(chunk: ArrayBuffer): void {
    this.chunksSent++;
    this.worker.postMessage({
      command: "processChunk",
      data: chunk,
      fileName: this.recordingName,
    });
  }

  // Clean up when done
  finalize(): void {
    if (this.chunksSent == this.chunksProcessed) {
      this.worker.terminate();
    }
  }
}
