import React, { Component } from "react";
import THREE from "three";

class Viz extends Component {
  componentDidMount() {
    const { canvas } = this;
    const { innerWidth, innerHeight } = window;

    console.log(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      1,
      6000
    );
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x333333);

    const light = new THREE.HemisphereLight("#fff", "#666", 1.5);
    light.position.set(0, 1000, 0);
    scene.add(light);
  }

  render() {
    return <canvas ref={d => (this.canvas = d)} />;
  }
}

export default Viz;
