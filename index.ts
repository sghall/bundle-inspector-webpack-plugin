import { processStats } from "./process";
// import { launchServer } from "./server";
// import {
//   formatProcessedSourceMaps,
//   getWritePathForSerializedData
// } from "./utils";
import * as meow from "meow";
import * as fs from "fs";
import * as path from "path";

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
  // launchServer("demo.json");
} else {
  // const processed = processSourceMaps(cli.input[0], {
  //   logLevel: cli.flags["verbose"] || cli.flags["v"] ? "verbose" : "silent"
  // });

  const map: string = fs.readFileSync(path.resolve(cli.input[0]), "utf-8");

  // const stringifedData = formatProcessedSourceMaps(processed);

  // if (cli.flags["stdout"] || cli.flags["o"]) {
  console.log("input!!!", processStats(JSON.parse(map)));
  // } else {
  //   const dataPath = `data_${Date.now()}`;
  //   const writePath = getWritePathForSerializedData(dataPath);

  // fs.writeFileSync(writePath, stringifedData);

  // launchServer(dataPath);
  // }
}
