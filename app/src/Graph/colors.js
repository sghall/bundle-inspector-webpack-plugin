import React, { Component } from "react";
import * as THREE from "three";
import { select } from "subunit";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter
} from "d3-force-3d";

const redMaterial = new THREE.MeshPhongMaterial({
  color: "#9a0b20",
  emissive: "#c7233c",
  specular: "#f5f5f5",
  shininess: 90
});

const greenMaterial = new THREE.MeshPhongMaterial({
  color: "#008C9E",
  emissive: "#005F6B",
  specular: "#f5f5f5",
  shininess: 90
});

export default function(d) {
  if (d.path && d.path.startsWith("./node_modules")) {
    return redMaterial;
  }

  return greenMaterial;
}
