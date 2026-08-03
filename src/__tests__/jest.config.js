// const { join } = require("path")

//

module.exports = {
  // rootDir: ".",
  testRegex: "/.*\\.spec\\.js$",
  testEnvironment: "jsdom",
  //snapshotResolver: join(__dirname, "./snapshotResolver.js"),
  //testEnvironmentOptions: require("./knexfile.ts"),
  //testEnvironment: join(__dirname, "../..", require("../../package.json").main),
  setupFilesAfterEnv: ["<rootDir>/setup.js", "@testing-library/jest-dom/extend-expect"],
}
