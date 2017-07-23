import { scaleLinear } from "d3-scale";
import { interpolateCubehelixLong } from "d3-interpolate";

const cubhelix = interpolateCubehelixLong("blue", "red");

export function chunkColors(data) {
  const scale = scaleLinear().range([0.1, 0.9]).domain([0, data.length - 1]);

  const colors = {};

  data.forEach((d, i) => {
    colors[d.label] = cubhelix(scale(i));
  });

  return chunkName => colors[chunkName];
}

function createNode(data) {
  return {
    label: data.label || "(root)",
    value: data.statSize || 0,
    path: data.path || "(root)"
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

export function createNodesAndLinks(data) {
  const nodes = [];
  const links = [];
  const names = [];
  const sizes = [Infinity, -Infinity];

  function add(children, parent, chunkName) {
    for (let i = 0; i < children.length; i++) {
      const target = children[i];

      nodes.push(target);

      links.push({
        source: parent,
        target,
        chunkName
      });

      if (target.groups) {
        add(target.groups, target, chunkName);
      } else {
        if (target.statSize < sizes[0]) {
          sizes[0] = target.statSize;
        }

        if (target.statSize > sizes[1]) {
          sizes[1] = target.statSize;
        }
      }
    }
  }

  for (let i = 0; i < data.length; i++) {
    const chunk = data[i];
    nodes.push(chunk);
    names.push({ label: chunk.label, value: true });
    add(chunk.groups, chunk, chunk.label);
  }

  return {
    names,
    nodes,
    links,
    sizes
  };
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
