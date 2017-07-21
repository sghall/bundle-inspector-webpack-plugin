import React, { Component } from "react";
import * as THREE from "three";
import { select } from "subunit";
import { range } from "d3-array";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceX,
  forceY
} from "d3-force";

// export {default as forceCenter} from "./src/center";
// export {default as forceCollide} from "./src/collide";
// export {default as forceLink} from "./src/link";
// export {default as forceManyBody} from "./src/manyBody";
// export {default as forceSimulation} from "./src/simulation";
// export {default as forceX} from "./src/x";
// export {default as forceY} from "./src/y";

class Viz extends Component {
  componentDidMount() {
    const { canvas } = this;
    const { innerWidth, innerHeight } = window;
    const aspect = innerWidth / innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    camera.position.z = 800;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x333333);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

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

    const simulation = forceSimulation(nodes)
      .force("charge", forceManyBody())
      .force("link", forceLink(links).distance(20).strength(1))
      .force("x", forceX())
      .force("y", forceY())
      .on("tick", ticked);

    const rootNode = select(scene);
    const container = rootNode.append("object");
    const geometry = new THREE.SphereGeometry(5, 10, 10);
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
      .attr("position", d => {
        return { x: 0, y: 0, z: 0 };
      });

    function ticked() {
      node.attr("position", d => {
        return { x: d.x || 0, y: d.y || 0, z: 0 };
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
