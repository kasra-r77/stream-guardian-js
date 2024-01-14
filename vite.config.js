import { defineConfig } from "vite";
import path from "path";

module.exports = defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es", "umd"],
      name: "stream-guardian-js",
      fileName: (format) => `stream-guardian-js.${format}.js`,
    },
    watch: {
      include: "src/**",
    },
  },
});
