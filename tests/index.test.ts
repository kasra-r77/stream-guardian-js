import { describe, test, expect, vi } from "vitest";
import StreamGuardian from "../src/index";

global.MediaStream = vi.fn().mockImplementation(() => ({
  getTracks: vi.fn().mockReturnValue([]),
}));

// @ts-expect-error
global.MediaRecorder = vi.fn().mockImplementation(() => {
  return {
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  };
});

global.MediaRecorder.isTypeSupported = vi.fn().mockReturnValue(true);

global.Worker = vi.fn().mockImplementation(() => ({
  terminate: vi.fn(),
}));

const mockFileName = "testFile.txt";
const mockFileType = "video/webm;codecs=vp9";
const mockFileContent = "1";
const mockFile = new File([mockFileContent], mockFileName, {
  type: mockFileType,
});
// @ts-expect-error
global.navigator = {
  storage: {
    getDirectory: vi.fn().mockResolvedValue({
      getFileHandle: vi.fn().mockResolvedValue({
        getFile: vi.fn().mockResolvedValue(mockFile),
      }),
    }),
    estimate: vi.fn(),
    persist: vi.fn(),
    persisted: vi.fn(),
  },
};

describe("StreamGuardianJS", () => {
  test("StreamGuardian initializes correctly", () => {
    const mockStream = new MediaStream();
    const mimeType = "video/webm";

    const streamGuardian = new StreamGuardian(mockStream, mimeType);

    expect(streamGuardian.stream).toBe(mockStream);
  });

  describe("StreamGuardian.record()", () => {
    test("record method starts MediaRecorder and handles data", () => {
      const mockStream = new MediaStream();
      const mimeType = "video/webm";

      const streamGuardian: any = new StreamGuardian(mockStream, mimeType);

      streamGuardian.record();

      expect(streamGuardian.recorder.start).toBeCalledWith(100);
      expect(streamGuardian.recorder.ondataavailable).toBeDefined();
    });
  });

  describe("StreamGuardian.blolbUrl()", () => {
    test("blobUrl method creates a Blob URL from chunks", () => {
      const mockStream = new MediaStream();
      const streamGuardian: any = new StreamGuardian(mockStream);

      // Mock Blob and URL.createObjectURL
      global.Blob = vi.fn().mockImplementation((chunks, options) => {
        return { chunks, options };
      });
      global.URL.createObjectURL = vi.fn();

      const chunk = new Blob(["chunk1"], { type: "video/webm;codecs=vp9" });

      // adding chunks
      streamGuardian.chunks.push(chunk);

      streamGuardian.blobUrl();

      expect(Blob).toHaveBeenCalledWith([chunk], {
        type: streamGuardian.finalMimeType,
      });
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(
        new Blob([chunk], { type: "video/webm;codecs=vp9" })
      );
    });
  });

  describe("StreamGuardian.stop()", () => {
    test("stops MediaRecorder and finalizes chunk persistence", () => {
      const mockStream = new MediaStream();
      const streamGuardian: any = new StreamGuardian(mockStream);

      // Mock necessary methods
      const stopSpy = vi.spyOn(streamGuardian.recorder, "stop");
      const finalizeSpy = vi.spyOn(
        streamGuardian.chunkPersistenceManager,
        "finalize"
      );
      const blobUrlSpy = vi.spyOn(streamGuardian, "blobUrl");

      streamGuardian.stop();

      expect(stopSpy).toHaveBeenCalled();
      expect(finalizeSpy).toHaveBeenCalled();
      expect(blobUrlSpy).toHaveBeenCalled();
    });
  });

  describe("StreamGuardian.recover()", () => {
    test("retrieves and creates a Blob URL for a specific file", async () => {
      const mockStream = new MediaStream();
      const streamGuardian = new StreamGuardian(mockStream);

      await streamGuardian.recover(mockFileName);

      expect(global.navigator.storage.getDirectory).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(
        new Blob([mockFile], { type: mockFileType })
      );
    });
  });
});
