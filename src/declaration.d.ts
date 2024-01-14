interface FileSystemSyncAccessHandle {
  flush(): Promise<void>;
  getSize(): number;
  read(buffer: Uint8Array, options?: { at?: number }): number;
  close(): void;
}

declare global {
  interface FileSystemFileHandle extends FileSystemHandle {
    createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle>;
  }

  interface FileSystemDirectoryHandle extends FileSystemHandle {
    values(): AsyncIterableIterator<FileSystemHandle>;
  }
}

export {};
