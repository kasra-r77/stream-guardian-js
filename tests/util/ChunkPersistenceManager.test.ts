import ChunkPersistenceManager from "../../src/util/ChunkPersistenceManager";
import { describe, test, expect, vi } from "vitest";

global.Worker = vi.fn().mockImplementation(() => ({
  terminate: vi.fn(),
  postMessage: vi.fn(),
}));

describe("ChunkPersistenceManager", () => {
  const manager: any = new ChunkPersistenceManager();

  test("ChunkPersistenceManager initializes correctly", () => {
    expect(manager.recordingName).toMatch(
      /\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/
    );
    expect(manager.worker).toBeDefined();
  });

  test("processChunk method sends data to worker", () => {
    const manager: any = new ChunkPersistenceManager();
    vi.spyOn(manager.worker, "postMessage");

    const mockChunk = new ArrayBuffer(10);
    manager.processChunk(mockChunk);

    expect(manager.worker.postMessage).toHaveBeenCalledWith({
      command: "processChunk",
      data: mockChunk,
      fileName: manager.recordingName,
    });
    expect(manager.chunksSent).toBe(1);
  });

  test("handleWorkerMessage increments chunksProcessed on success message", () => {
    manager.handleWorkerMessage(
      new MessageEvent("message", { data: "Chunk processed successfully." })
    );

    expect(manager.chunksProcessed).toBe(1);
  });

  test("finalize terminates worker when all chunks are processed", () => {
    manager.chunksSent = 1;
    manager.chunksProcessed = 1;

    manager.finalize();

    expect(manager.worker.terminate).toHaveBeenCalled();
  });
});
