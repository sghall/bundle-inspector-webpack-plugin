import * as THREE from "three";

const specular = "#f5f5f5";
const shininess = 95;

const nodeModuleFile = new THREE.MeshPhongMaterial({
  color: "#555",
  emissive: "#555",
  specular,
  shininess
});

const srFile = new THREE.MeshPhongMaterial({
  color: "#aaa",
  emissive: "#aaa",
  specular,
  shininess
});

const folder = new THREE.MeshPhongMaterial({
  color: "green",
  emissive: "green",
  specular,
  shininess
});

const bundleRoot = new THREE.MeshPhongMaterial({
  color: "yellow",
  emissive: "yellow",
  specular,
  shininess
});

export default function(d) {
  if (d.path === "(root)") {
    return bundleRoot;
  }

  if (d.hasChildren) {
    return folder;
  }

  if (d.path.includes("node_modules")) {
    return nodeModuleFile;
  }

  return srFile;
}
