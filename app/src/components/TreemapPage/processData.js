const createNode = (d, chunkName) => ({
  name: d.label || "(root)",
  path: d.path || "(root)",
  size: d.statSize || 0,
  chunkName
});

export default function createTree(data) {
  function add(children = [], parent, chunkName) {
    if (children.length > 0) {
      parent.children = [];
    }

    for (let i = 0; i < children.length; i++) {
      const child = createNode(children[i], chunkName);
      parent.children.push(child);

      if (Array.isArray(children[i].groups)) {
        add(children[i].groups, child, chunkName);
      }
    }
  }

  let tree;

  if (data.length === 1) {
    tree = createNode(data[0], data[0].label);
    add(data[0].groups, tree, data[0].label);
  } else {
    tree = createNode(data);
    tree.children = [];

    for (let i = 0; i < data.length; i++) {
      const chunk = createNode(data[i], data[i].label);
      tree.children.push(chunk);
      add(data[i].groups, chunk, data[i].label);
    }
  }

  return tree;
}
