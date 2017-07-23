function createNode(data) {
  return {
    label: data.label || "",
    value: data.statSize || 0,
    path: data.path || "(root)"
  };
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

  const tree = { children: [] };

  for (let i = 0; i < data.length; i++) {
    const chunk = createNode(data[i]);
    tree.children.push(chunk);
    add(data[i].groups, chunk);
  }

  return tree;
}