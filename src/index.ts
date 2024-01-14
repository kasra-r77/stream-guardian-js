import ChunkPersistenceManager from "./util/ChunkPersistenceManager";
import { selectBestSupportedMimeType } from "./util/mimeType";

export default class StreamGuardian {
  readonly stream: MediaStream;
  private chunks: Blob[] = [];
  private recorder: MediaRecorder;
  private chunkPersistenceManager: ChunkPersistenceManager;
  private finalMimeType: string | undefined;

  constructor(stream: MediaStream, mimeType?: string) {
    this.stream = stream;
    this.finalMimeType = mimeType ? mimeType : selectBestSupportedMimeType();

    this.recorder = new MediaRecorder(stream, { mimeType: this.finalMimeType });
    this.chunkPersistenceManager = new ChunkPersistenceManager();
  }

  record() {
    // start recording in 100 ms intervals
    this.recorder.start(100);
    this.recorder.ondataavailable = async (e) => {
      const bufferedData = await e.data.arrayBuffer();
      this.chunks.push(e.data);
      this.chunkPersistenceManager.processChunk(bufferedData);
    };
  }

  blobUrl(): string {
    return URL.createObjectURL(
      new Blob(this.chunks, { type: this.finalMimeType })
    );
  }

  stop() {
    this.recorder.stop();
    this.chunkPersistenceManager.finalize();
    return this.blobUrl();
  }

  async listStoredFiles(): Promise<Array<File["name"]>> {
    try {
      const root = await navigator.storage.getDirectory();
      const entries = [];
      for await (const entry of root.values()) {
        if (entry.kind === "file") {
          entries.push(entry.name);
        }
      }
      return entries;
    } catch (error) {
      console.error("Error listing files:", error);
      return [];
    }
  }

  async recover(fileName: string): Promise<string | null> {
    try {
      const root = await navigator.storage.getDirectory();
      const fileHandle = await root.getFileHandle(fileName, { create: false });
      const file = await fileHandle.getFile();
      const blobUrl = URL.createObjectURL(
        new Blob([file], { type: this.finalMimeType })
      );
      return blobUrl;
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === "NotFoundError") {
          console.error("File not found:", fileName);
          return null;
        }
      }
      console.error("Error recovering file:", error);
      return null;
    }
  }
}
