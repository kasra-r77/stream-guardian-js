// workerScript.js
onmessage = async function (event) {
  const { command, data, fileName } = event.data;

  if (command === "processChunk") {
    const root = await navigator.storage.getDirectory();

    const draftHandle = await root.getFileHandle(fileName, { create: true });
    const accessHandle = await draftHandle.createSyncAccessHandle();

    // Calculate the size of the file to append data at the end
    const size = accessHandle.getSize();
    accessHandle.truncate(size + data.byteLength); // Extend the file size

    // Write the blob data
    accessHandle.write(data, {
      at: size,
    });
    accessHandle.flush();
    accessHandle.close();

    postMessage("Chunk processed successfully.");
  }
};
