/**
 * The Dummy code to test
 * Just a function that returns the first argument after 600ms
 * @param {*} content
 */
function longRunningFunction(content) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(content);
    }, 600);
  });
}

// This is only needed in the test repro
// If the snapshots don't exist, leave the time for them to be created
// If they exist, fail the test on purpose
const fs = require("fs");
const path = require("path");
const snapshotFile = `${path.basename(__filename)}.snap`;
const snapshotPath = path.dirname(process.cwd(), "__snapshots__", snapshotFile);
if (fs.existsSync(snapshotPath)) {
  jest.setTimeout(400);
}

// The tests
it("Runs a first test", async () => {
  expect(
    await longRunningFunction("Content of the first test")
  ).toMatchSnapshot();
});

it("Runs a second test", async () => {
  expect(
    await longRunningFunction("Content of the second test")
  ).toMatchSnapshot();
});
