const { getViewerData } = require("webpack-bundle-analyzer/lib/analyzer");

export const processSourceMaps = file => {
  return file;
};

export const processStats = stats => {
  return getViewerData(stats);
};
