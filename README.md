# stream-guardian-js

Stream Guardian JS is a library designed to safeguard streaming content recorded in web browsers. By utilizing the Origin Private File System (OPFS), it ensures that all recorded streams are securely saved locally on the user's device. This system not only protects the recordings but also facilitates the recovery of recorded files, ensuring that your data remains intact and accessible.

## Features

- Secure Recording: Ensures all streaming content is securely recorded in the browser.
- Local Storage: Utilizes OPFS for saving data locally on the user's device.
- Data Recovery: Facilitates easy recovery of recorded files.
- Using web workers: Utilizes web workers to ensure that the recording process does not affect the performance of the main thread.

## API

Stream Guardian JS provides an API to interact with the stream recording and management functionalities. Below are the details of the API endpoints and their usage.

### `constructor`

```javascript
const streamGuardian = new StreamGuardian({
  stream: stream,
  mimeType: "video/webm;codecs=vp9", // or whatever mime type is appropriate
});
```

**Note:** `mimeType` is optional. If not provided, there is a [list](https://github.com/kasra-r77/stream-guardian-js/blob/3a9647501d4d7470163be79a42f7a4a4edea8bf0/src/util/mimeType.ts#L1) of default mime types that will be used based on the browser compatibility.

- `record()`: Starts recording the stream.
- `stop()`: Stops recording the stream.
- `pause()`: Pauses recording the stream.
- `resume()`: Resumes recording the stream.
- `blobUrl()`: Returns the blob url of the current(on going) recording.
- `listStoredFiles()`: Lists all the files stored in the storage:
  - by default files are stored in 'YYYY-MM-DD_HH-MM-SS' format
- `recover(fileName: string)`: Recovers the file from the storage:
  - fileName: name of the file to be recovered
  - listStoredFiles() can be used to get the list of files stored in the storage

## Example

```typescript
const streamGuardian = new StreamGuardian({
  stream: stream,
  mimeType: "video/webm;codecs=vp9",
});

streamGuardian.record(); // starts recording the stream
streamGuardian.pause(); // pauses recording the stream
streamGuardian.resume(); // resumes recording the stream
streamGuardian.stop(); // stops recording the stream

const recordList: Array<string> = streamGuardian.listStoredFiles(); // lists all the files stored in the storage

streamGuardian.recover(recordList[0]); // recovers the file from the storage
```

## Contributing

Contributions to Stream Guardian JS are always welcome. Whether it's bug fixes, feature enhancements, or documentation improvements, feel free to make a pull request.

## License

This project is licensed under MIT License.\
