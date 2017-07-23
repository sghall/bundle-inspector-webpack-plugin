const createNode = d => ({
  name: d.label || "(root)",
  path: d.path || "(root)",
  size: d.statSize || 0,
  hasChildren: !!d.groups
});

export default function processData(data) {
  const nodes = [];
  const links = [];
  const sizes = [Infinity, -Infinity];

  function add(children, parent, chunkName) {
    for (let i = 0; i < children.length; i++) {
      const target = createNode(children[i]);

      nodes.push(target);

      links.push({
        source: parent,
        target,
        chunkName
      });

      if (children[i].groups) {
        add(children[i].groups, target, chunkName);
      } else {
        if (target.size < sizes[0]) {
          sizes[0] = target.size;
        }

        if (target.size > sizes[1]) {
          sizes[1] = target.size;
        }
      }
    }
  }

  for (let i = 0; i < data.length; i++) {
    const chunk = createNode(data[i]);
    nodes.push(chunk);
    add(data[i].groups, chunk, chunk.name);
  }

  return {
    nodes,
    links,
    sizes
  };
}
