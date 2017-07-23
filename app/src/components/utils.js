import { scaleLinear } from "d3-scale";
import { interpolateCubehelixLong } from "d3-interpolate";

const cubhelix = interpolateCubehelixLong("green", "red");

export function createColors(data) {
  const scale = scaleLinear().range([0.25, 0.9]).domain([0, data.length - 1]);

  const colors = {};

  data.forEach((d, i) => {
    colors[d.label] = cubhelix(scale(i));
  });

  return chunkName => colors[chunkName];
}

export function formatBytes(bytes, decimals) {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const isNegative = bytes < 0;

  const k = 1024;
  const dm = decimals + 1 || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));

  if (!sizes[i]) {
    return "";
  }

  const value = `${parseFloat((Math.abs(bytes) / k ** i).toFixed(dm))}  ${sizes[
    i
  ]}`;

  if (isNegative) {
    return `-${value}`;
  }

  return value;
}
