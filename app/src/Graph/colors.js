import React, { Component } from "react";
import * as THREE from "three";
import { select } from "subunit";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter
} from "d3-force-3d";

const specular = "#f5f5f5";
const shininess = 90;

const redMaterial = new THREE.MeshPhongMaterial({
  color: "#9a0b20",
  emissive: "#c7233c",
  specular,
  shininess
});

const greenMaterial = new THREE.MeshPhongMaterial({
  color: "#008C9E",
  emissive: "#005F6B",
  specular,
  shininess
});

const greyMaterial = new THREE.MeshPhongMaterial({
  color: "#777777",
  emissive: "#333333",
  specular,
  shininess
});

const yellowMaterial = new THREE.MeshPhongMaterial({
  color: "#999900",
  emissive: "#999900",
  specular,
  shininess
});

export default function(d) {
  if (!d.path) {
    return yellowMaterial;
  }

  if (d.groups) {
    return greyMaterial;
  }

  if (d.path.startsWith("./node_modules")) {
    return redMaterial;
  }

  return greenMaterial;
}
