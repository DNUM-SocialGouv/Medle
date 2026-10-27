// const { join } = require("path")

//

module.exports = {
  rootDir: "../..",
  testRegex: "/src/__tests__/.*\\.spec\\.js$",
  testEnvironment: "jsdom",
  //snapshotResolver: join(__dirname, "./snapshotResolver.js"),
  //testEnvironmentOptions: require("./knexfile.ts"),
  //testEnvironment: join(__dirname, "../..", require("../../package.json").main),
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js", "@testing-library/jest-dom/extend-expect"],
}
