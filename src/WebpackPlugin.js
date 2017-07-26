const fse = require("fs-extra");
const path = require("path");
const { yellow } = require("chalk");
const launchServer = require("./server");
const { processStats } = require("./process");
const { getWritePathForSerializedData } = require("./utils");

class WebpackPlugin {
  constructor(opts) {
    this.opts = {
      generateStatsFile: false,
      statsFilename: "stats.json",
      statsOptions: null
    };

    this.server = null;
  }

  apply(compiler) {
    this.compiler = compiler;

    compiler.plugin("done", stats => {
      stats = stats.toJson(this.opts.statsOptions);

      const actions = [];

      if (this.opts.generateStatsFile) {
        actions.push(() => this.generateStatsFile(stats));
      }

      const dataFile = `data_${Date.now()}`;
      const writePath = getWritePathForSerializedData(dataFile);

      fse.writeFileSync(writePath, processStats(stats));
      actions.push(() => this.startServer(dataFile));

      if (actions.length) {
        setImmediate(() => {
          actions.forEach(action => action());
        });
      }
    });
  }

  generateStatsFile(stats) {
    const { compiler: { outputPath }, opts: { statsFilename } } = this;
    const statsFilepath = path.resolve(outputPath, statsFilename);

    fse.ensureDirSync(path.dirname(statsFilepath));
    fse.writeJsonSync(statsFilepath, stats, { spaces: 2 });

    console.log(
      `${yellow("Chunky Monkey")} saved stats file to ${yellow(statsFilepath)}`
    );
  }

  startServer(dataFile) {
    if (this.server) {
      this.server(dataFile);
    } else {
      this.server = launchServer(dataFile);
    }
  }
}

module.exports = WebpackPlugin;
