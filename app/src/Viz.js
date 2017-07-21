import React, { Component } from "react";
import * as THREE from "three";
import * as subunit from "subunit";

class Viz extends Component {
  componentDidMount() {
    const { canvas } = this;
    const { innerWidth, innerHeight } = window;
    const aspect = innerWidth / innerHeight;

    console.log(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, aspect, 1, 6000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x333333);

    const light = new THREE.HemisphereLight("#fff", "#666", 1.5);
    light.position.set(0, 1000, 0);
    scene.add(light);

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    const rootNode = subunit.select(scene);
    const container = rootNode.append("object");
    const geometry = new THREE.BoxBufferGeometry(400, 400, 400);
    const material = new THREE.MeshPhongMaterial({ color: "blue" });

    const boxes = container
      .selectAll("chart")
      .data([1, 2, 3, 4, 5])
      .enter()
      .append("mesh")
      .attr("material", material)
      .attr("geometry", geometry)
      .attr("position", d => {
        return { x: d * 500, y: 0, z: 0 };
      });

    const theta = 0.01;

    function animate() {
      rootNode.node().rotation.y += theta;
      boxes.each(function(d, i) {
        this.rotation.x += theta * ((i + 1) * 2);
      });
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
