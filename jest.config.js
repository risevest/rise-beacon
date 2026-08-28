/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  verbose: false,
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "/tests/.*\\.spec\\.ts$",
  moduleFileExtensions: ["ts", "js", "json", "node"]
};
