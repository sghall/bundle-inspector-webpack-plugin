import React, { Component } from "react";
import * as THREE from "three";
import { select } from "subunit";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter
} from "d3-force-3d";

class Viz extends Component {
  componentDidMount() {
    const { canvas, props: { nodes, links } } = this;
    const { innerWidth, innerHeight } = window;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x333333);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 2000, 0);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 5000;
    spotLight.shadow.camera.fov = 30;

    scene.add(spotLight);

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    forceSimulation()
      .numDimensions(3)
      .nodes(nodes)
      .force("link", forceLink(links).distance(20).strength(1))
      .force("charge", forceManyBody())
      .force("center", forceCenter())
      .on("tick", ticked);

    const rootNode = select(scene);
    const container = rootNode.append("object");

    const nodeGeometry = new THREE.SphereGeometry(2, 10, 10);

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

    const node = container
      .selectAll("node")
      .data(nodes)
      .enter()
      .append("mesh")
      .attr("geometry", nodeGeometry)
      .attr("material", d => {
        if (d.path && d.path.startsWith("./node_modules")) {
          return redMaterial;
        }

        return greenMaterial;
      })
      .attr("position", () => {
        return { x: 0, y: 0, z: 0 };
      });

    const linkMaterial = new THREE.LineBasicMaterial({
      color: 0xf5f5f5,
      transparent: true
    });

    const link = container
      .selectAll("link")
      .data(links)
      .enter()
      .append("line")
      .attr("material", linkMaterial)
      .attr("geometry", () => {
        const geometry = new THREE.Geometry();
        geometry.vertices = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, 0)
        ];

        return geometry;
      });

    function ticked() {
      node.attr("position", ({ x, y, z }) => {
        return { x, y, z };
      });

      link.each(function({ source, target }) {
        this.geometry.vertices = [
          new THREE.Vector3(source.x, source.y || 0, source.z || 0),
          new THREE.Vector3(target.x, target.y || 0, target.z || 0)
        ];

        this.geometry.verticesNeedUpdate = true;
        this.geometry.computeBoundingSphere();
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
