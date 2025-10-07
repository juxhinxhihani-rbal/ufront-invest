/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { createEslintConfig } = require("@rbal-modern-luka/eslint-codestyle");

module.exports = createEslintConfig((config) => ({
  ...config,
  ignorePatterns: [".eslintrc.js", "vite.config.ts", "moduleConfigs.types.ts"],
}));
