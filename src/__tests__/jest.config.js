module.exports = {
  rootDir: "../..",
  testRegex: "/src/__tests__/.*\\.spec\\.js$",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js", "@testing-library/jest-dom/extend-expect"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["cobertura", "text-summary"],
}
