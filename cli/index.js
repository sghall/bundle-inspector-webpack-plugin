const { processStats } = require("./process");
const { getWritePathForSerializedData } = require("./utils");
const meow = require("meow");
const fs = require("fs");
const path = require("path");

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
      o: 'stdout',
      v: 'verbose'
    },
    boolean: ["stdout", "verbose", "demo"]
  }
);

if (cli.input.length === 0 && !cli.flags["demo"]) {
  cli.showHelp();
  process.exit(2);
}

if (cli.flags["demo"]) {
  // launchServer('demo.json');
} else {
  const stats = fs.readFileSync(path.resolve(cli.input[0]), "utf-8");

  const dataPath = `data_${Date.now()}`;
  const writePath = getWritePathForSerializedData(dataPath);

  fs.writeFileSync(writePath, processStats(stats));

  // launchServer(dataPath);

  console.log("input!!!", writePath);
}
