import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

import { allProxyConfigs } from "./proxyConfigs";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["react", "@emotion/react"],
      output: {
        format: "esm",
        manualChunks: (id) => {
          if (id.indexOf("@rbal-modern-luka/ui-library") !== -1)
            return "rbal-ui-library";
          return "vendor";
        },
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(process.cwd(), "./src"),
      "~rbal-luka-portal-shell": toWorkspaceSrcDir("rbal-luka-portal-shell"),
    },
  },

  server: {
    https: {
      // Github rejects commits with keys and certs in plaintext
      // but it will accept it when they are encoded in base64
      cert: Buffer.from(
        fs.readFileSync("./devserver.crt.base64").toString("utf8"),
        "base64"
      ).toString("utf-8"),
      key: Buffer.from(
        fs.readFileSync("./devserver.key.base64").toString("utf8"),
        "base64"
      ).toString("utf-8"),
    },
    port: 5173,

    proxy: {
      ...allProxyConfigs,
    },
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});

function toWorkspaceSrcDir(workspaceName: string): string {
  return path.resolve(process.cwd(), `./packages/${workspaceName}/src`);
}
