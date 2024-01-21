import { defineConfig } from "vite";
import path from "path";
import typescript from "@rollup/plugin-typescript";

module.exports = defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es", "umd"],
      name: "stream-guardian-js",
      fileName: (format) => `stream-guardian-js.${format}.js`,
    },
    rollupOptions: {
      plugins: [
        typescript({
          tsconfig: path.resolve(__dirname, "tsconfig.json"),
        }),
      ],
    },
    watch: {
      include: "src/**",
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    globals: true,
    environment: "happy-dom",
  },
});
