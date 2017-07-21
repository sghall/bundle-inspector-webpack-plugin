const { getViewerData } = require("webpack-bundle-analyzer/lib/analyzer");

module.exports = {
  processSourceMaps: file => {
    return file;
  },
  processStats: stats => {
    return getViewerData(stats);
  }
};
