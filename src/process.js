const { getViewerData } = require("webpack-bundle-analyzer/lib/analyzer");

module.exports = {
  processStats: stats => {
    const processed = getViewerData(stats);
    return JSON.stringify(processed);
  }
};
