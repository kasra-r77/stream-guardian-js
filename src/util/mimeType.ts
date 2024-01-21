export const preferredMimeTypesInOrder = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm;codecs=h264",
  "video/mp4;codecs=h264",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg",
];

export function selectBestSupportedMimeType(
  preferredMimeTypes = preferredMimeTypesInOrder
) {
  let bestType: string | undefined = undefined;
  for (const mimeType of preferredMimeTypes) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      bestType = mimeType;
      break;
    }
  }

  if (bestType) {
    return bestType;
  }
  console.error("No supported MIME type found");
  return undefined;
}
