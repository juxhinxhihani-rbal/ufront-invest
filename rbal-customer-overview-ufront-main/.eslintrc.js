const { createEslintConfig } = require("@rbal-modern-luka/eslint-codestyle");

module.exports = createEslintConfig((config) => ({
  ...config,
  ignorePatterns: [".eslintrc.js", "vite.config.ts"],
}));
