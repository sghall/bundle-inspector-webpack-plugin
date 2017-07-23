import { scaleLinear } from "d3-scale";
import { interpolateCubehelixLong } from "d3-interpolate";

const cubhelix = interpolateCubehelixLong("blue", "red");

export function createColors(data) {
  const scale = scaleLinear().range([0.1, 0.9]).domain([0, data.length - 1]);

  const colors = {};

  data.forEach((d, i) => {
    colors[d.label] = cubhelix(scale(i));
  });

  return chunkName => colors[chunkName];
}

function createNode(d) {
  return {
    label: d.label || "(root)",
    value: d.statSize || 0,
    path: d.path || "(root)"
  };
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

  const value = `${parseFloat(
    Math.pow(Math.abs(bytes) / k, i).toFixed(dm)
  )}  ${sizes[i]}`;

  if (isNegative) {
    return `-${value}`;
  }

  return value;
}

export function createTree(data) {
  function add(children = [], parent) {
    if (children.length > 0) {
      parent.children = [];
    }

    for (let i = 0; i < children.length; i++) {
      const child = createNode(children[i]);
      parent.children.push(child);

      if (Array.isArray(children[i].groups)) {
        add(children[i].groups, child);
      }
    }
  }

  let tree;

  if (data.length === 1) {
    tree = createNode(data[0]);
    add(data[0].groups, tree);
  } else {
    tree = createNode(data);
    tree.children = [];

    for (let i = 0; i < data.length; i++) {
      const chunk = createNode(data[i]);
      tree.children.push(chunk);
      add(data[i].groups, chunk);
    }
  }

  return tree;
}
