const { processStats } = require("./process");
const meow = require("meow");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const { getWritePathForSerializedData } = require("./utils");
const server = require("./server");

const cli = meow(
  `
  Usage:
    analyzer-3d-webpack-plugin  <stats file path>

  Options:
    --demo: view demo

  Example:
    analyzer-3d-webpack-plugin my_app/stats.json
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

  const dataPath = `data_${Date.now()}`;
  const writePath = getWritePathForSerializedData(dataPath);

  fs.writeFileSync(writePath, processStats(stats));

  console.log(`
    stats file: ${chalk.yellow(input)}
    data file: ${chalk.yellow(dataPath)}
  `);

  server(dataPath);
}
