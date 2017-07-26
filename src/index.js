const meow = require("meow");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const server = require("./server");
const { processStats } = require("./process");
const { getWritePathForSerializedData } = require("./utils");

const cli = meow(
  `
  Usage:
    chunky-monkey  <stats file path>

  Options:
    --demo: view demo

  Example:
    chunky-monkey my_app/stats.json
`,
  {
    boolean: ["demo"]
  }
);

if (cli.input.length === 0 && !cli.flags["demo"]) {
  cli.showHelp();
  process.exit(2);
}

if (cli.flags["demo"]) {
  server("demo");
} else {
  const input = cli.input[0];
  const stats = fs.readFileSync(path.resolve(input), "utf-8");

  const dataFile = `data_${Date.now()}`;
  const writePath = getWritePathForSerializedData(dataFile);

  fs.writeFileSync(writePath, processStats(JSON.parse(stats)));

  console.log(`
    stats file: ${chalk.yellow(input)}
    data file: ${chalk.yellow(dataFile)}
  `);

  server(dataFile);
}
