const fse = require("fs-extra");
const path = require("path");
const { yellow } = require("chalk");
const server = require("./server");

class WebpackPlugin {
  constructor(opts) {
    this.opts = {
      host: "127.0.0.1",
      port: 8888,
      open: true,
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

      actions.push(() => this.startServer(stats));

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

  startServer(stats) {
    const { opts: { open, host, port } } = this;

    if (this.server) {
      this.server(stats);
    } else {
      this.server = viewer.startServer(stats, {
        open,
        host,
        port
      });
    }
  }
}

module.exports = WebpackPlugin;
