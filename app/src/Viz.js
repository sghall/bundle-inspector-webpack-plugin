import React, { Component } from "react";
import * as THREE from "three";
import { select } from "subunit";
import { range } from "d3-array";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter
} from "d3-force-3d";

class Viz extends Component {
  componentDidMount() {
    const { canvas } = this;
    const { innerWidth, innerHeight } = window;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x333333);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-500, 1000, 0);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add(spotLight);

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    const nodes = range(1000).map(function(i) {
      return {
        index: i
      };
    });

    const links = range(nodes.length - 1).map(function(i) {
      return {
        source: Math.floor(Math.sqrt(i)),
        target: i + 1
      };
    });

    forceSimulation()
      .numDimensions(3)
      .nodes(nodes)
      .force("link", forceLink(links).distance(20).strength(1))
      .force("charge", forceManyBody())
      .force("center", forceCenter())
      .on("tick", ticked);

    const rootNode = select(scene);
    const container = rootNode.append("object");
    const geometry = new THREE.SphereGeometry(2, 10, 10);
    const material = new THREE.MeshPhongMaterial({
      color: "blue",
      shininess: 80
    });

    const node = container
      .selectAll("node")
      .data(nodes)
      .enter()
      .append("mesh")
      .attr("material", material)
      .attr("geometry", geometry)
      .attr("position", () => {
        return { x: 0, y: 0, z: 0 };
      });

    function ticked() {
      node.attr("position", ({ x, y, z }) => {
        return { x, y, z };
      });
    }

    const theta = 0.01;

    function animate() {
      rootNode.node().rotation.y += theta;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }

  render() {
    return <canvas ref={d => (this.canvas = d)} />;
  }
}

export default Viz;
