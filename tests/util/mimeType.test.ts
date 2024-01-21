import {
  preferredMimeTypesInOrder,
  selectBestSupportedMimeType,
} from "../../src/util/mimeType";

import { describe, test, expect, vi } from "vitest";

describe("MimeType", () => {
  test("selects the first supported MIME type from the preferred list", () => {
    // @ts-expect-error
    global.MediaRecorder = {
      isTypeSupported: vi.fn(
        (mimeType) => mimeType === "video/webm;codecs=vp9"
      ),
    };

    const selectedMimeType = selectBestSupportedMimeType();

    expect(selectedMimeType).toBe("video/webm;codecs=vp9");
    expect(global.MediaRecorder.isTypeSupported).toHaveBeenCalled();
  });

  test("returns undefined when no MIME types are supported", () => {
    // @ts-expect-error
    global.MediaRecorder = {
      isTypeSupported: vi.fn(() => false),
    };

    const selectedMimeType = selectBestSupportedMimeType();

    expect(selectedMimeType).toBeUndefined();
    expect(global.MediaRecorder.isTypeSupported).toHaveBeenCalled();
  });

  test("selects the first supported MIME type from a custom list", () => {
    const customMimeTypes = ["custom/type", "video/mp4;codecs=h264"];

    // @ts-expect-error
    global.MediaRecorder = {
      isTypeSupported: vi.fn(
        (mimeType) => mimeType === "video/mp4;codecs=h264"
      ),
    };

    const selectedMimeType = selectBestSupportedMimeType(customMimeTypes);

    expect(selectedMimeType).toBe("video/mp4;codecs=h264");
    expect(global.MediaRecorder.isTypeSupported).toHaveBeenCalledWith(
      "video/mp4;codecs=h264"
    );
  });
});
