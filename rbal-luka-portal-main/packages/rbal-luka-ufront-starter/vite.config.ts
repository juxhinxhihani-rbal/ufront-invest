import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    outDir: "dist",
    minify: false,
    lib: {
      entry: "./src/index.ts",
      fileName: "index",
      formats: ["cjs"],
    },

    rollupOptions: {
      external: ["vite", "@vitejs/plugin-react", "fs", "path"],
    },
  },

  plugins: [dts()],
});
