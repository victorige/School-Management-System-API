module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/index.js"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "axion/connect/",
    "axion/managers/api/",
    "axion/managers/virtual_stack/",
  ],
};
