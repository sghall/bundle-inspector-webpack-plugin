import { getViewerData } from "webpack-bundle-analyzer/lib/analyzer";

export const processSourceMaps = (file: string): string => {
  return file;
};

export const processStats = (stats: object) => {
  return getViewerData(stats);
};
