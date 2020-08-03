// const { join } = require("path")

//

module.exports = {
  // rootDir: ".",
  testRegex: "/.*\\.spec\\.js$",
  //snapshotResolver: join(__dirname, "./snapshotResolver.js"),
  //testEnvironmentOptions: require("./knexfile.ts"),
  //testEnvironment: join(__dirname, "../..", require("../../package.json").main),
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
}
