import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  setupFiles: ["<rootDir>/tests/polyfills.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["<rootDir>/tests/**/*.test.{ts,tsx}"],
};

const jestConfig = createJestConfig(config);

export default async () => {
  const resolved = await jestConfig();
  resolved.transformIgnorePatterns = [
    "^.+\\.module\\.(css|sass|scss)$",
  ];
  return resolved;
};
