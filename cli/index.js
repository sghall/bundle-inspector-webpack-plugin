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
    bundle-buddy  <source_map_glob>

  Options:
    --verbose -v: Write verbose logging to stderr
    --stdout -o: Write analysis to stdout
    --demo: View a demo bundle

  Example:
    bundle-buddy my_app/dist/*.map
`,
  {
    alias: {
      o: "stdout",
      v: "verbose"
    },
    boolean: ["stdout", "verbose", "demo"]
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
    stat file: ${chalk.yellow(input)}
    data file: ${chalk.yellow(dataPath)}
  `);

  server(dataPath);
}
