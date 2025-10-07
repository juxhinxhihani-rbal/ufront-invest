import viteReact from "@vitejs/plugin-react";
import { defineConfig, UserConfigExport } from "vite";
import path from "path";
import fs from "fs";

export interface UFrontViteBuildOptions {
  /**
   * Name of the application.
   * It configures the path where singleSpaEntry is exposed: /ufronts/${name}/
   */
  name: string;
  /**
   * Configures emotion styling jsxImportSource to emotion react.
   * @default true
   */
  hasEmotionCss?: boolean;
  /**
   * Server port where the microfront will be exposed
   */
  serverPort: number;
  /**
   * Relative path to tsconfig.json
   * @default "./tsconfig.json"
   */
  tsConfigPath?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  sourcemap?: boolean;
}

const suggestedTsEntries = `
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
`;

type OverrideFn = (config: UserConfigExport) => UserConfigExport;

/**
 * Generates a default vite configuration for the microfront.
 *
 * The configuration creates a default "~" alias referencing "src" directory.
 * Alias configuration involves symmetrical configuraiton of vite and Typescript,
 * therefore the function checks the tsconfig.json configuration as well.
 *
 * @param options
 * @param overrideFn
 */
export function createUFrontViteBuild(
  options: UFrontViteBuildOptions,
  overrideFn?: OverrideFn
): UserConfigExport {
  checkTypescriptConfiguration(options);

  const reactPlugin = toReactPluginConfig(options);

  const buildConfig = defineConfig({
    build: {
      sourcemap: Boolean(options.sourcemap),
      rollupOptions: {
        preserveEntrySignatures: "strict",
        input: {
          // Must match the filename from the Portal's Microfrontend filename, either directly or indirectly (via proxy).
          //  - See /src/features/MicroFront.tsx
          singleSpaEntry: "./src/singleSpaEntry.ts",
        },
        output: {
          entryFileNames: "[name].js",
          format: "esm",
        },
        external: ["react", "@emotion/react"],
      },
    },
    resolve: {
      alias: {
        /*
         * As calls from dynamically imported μFrontend will be requesting paths as described in import,
         *   we need to replace the path in the dev server.
         * e.g.
         * import * from "~/example"
         * will result in GET <address>/~/example
         * As such, we need to do the rewrite to src, so that the dev portal will respond for:
         * GET <address/./src/example
         * And properly resolve files in the μFronted directory
         */
        "~": path.resolve(process.cwd(), "./src"),
      },
    },
    server: {
      // Must match portal proxyConfigs.ts
      port: options.serverPort,
    },
    /*
     * This entry is crucial, as the current implementation requires all the file/import calls to be available
     *  on the full path, like /ufronts/example/. Without this entry, the initial load of the μFrontend would succeed,
     *  but the following calls for any other resource (e.g. imports) would call the / path - as μFrontend does not know
     *  that it is actually a μFrontend. With base URL, the μFrontend will always call with the /ufronts path, allowing
     *  the proxy to work correctly
     * Must match the pattern in the /src/features/MicroFront.tsx
     * Must match the pattern in the proxyConfigs.ts
     */
    base: `/ufronts/${options.name}/`,
    plugins: [reactPlugin],
    esbuild: {
      logOverride: { "this-is-undefined-in-esm": "silent" },
    },
  });

  return overrideFn ? overrideFn(buildConfig) : buildConfig;
}

function toReactPluginConfig(options: UFrontViteBuildOptions) {
  return options.hasEmotionCss ?? true
    ? viteReact({
        jsxImportSource: "@emotion/react",
      })
    : viteReact();
}

function checkTypescriptConfiguration(options: UFrontViteBuildOptions) {
  const { tsConfigPath = "./tsconfig.json" } = options;
  const tsConfigLocation = path.resolve(process.cwd(), tsConfigPath);

  if (!fs.existsSync(tsConfigLocation)) {
    throw new Error(`${tsConfigLocation} does not exist.`);
  }

  const tsConfig = fs.readFileSync(tsConfigLocation, { encoding: "utf8" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let typescriptConfig: any = {};
  try {
    typescriptConfig = JSON.parse(tsConfig);
  } catch (err) {
    throw new Error(`${tsConfigLocation} contains invalid JSON.`);
  }

  if (!typescriptConfig.compilerOptions) {
    throw new Error(`${tsConfigLocation} does not contain "compilerOptions".`);
  }

  if (!typescriptConfig.compilerOptions.baseUrl) {
    throw new Error(
      `${tsConfigLocation} misses baseUrl entry. Therefore "~" alias will not work.\nSuggested config is: ${suggestedTsEntries}`
    );
  }

  if (!typescriptConfig.compilerOptions.paths?.["~/*"]) {
    throw new Error(
      `${tsConfigLocation} misses paths config for the "~" entry. Therefore "~" alias will not work.\nSuggested config is: ${suggestedTsEntries}`
    );
  }
}
