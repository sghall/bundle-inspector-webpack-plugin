const { getViewerData } = require("webpack-bundle-analyzer/lib/analyzer");

module.exports = {
  processSourceMaps: file => {
    return file;
  },
  processStats: stats => {
    const processed = getViewerData(JSON.parse(stats));
    return JSON.stringify(processed);
  }
};
