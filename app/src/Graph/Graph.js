import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import * as THREE from "three";
import OrbitControls from "../OrbitControls";
import { select } from "subunit";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter
} from "d3-force-3d";
import colors from "./colors";

class Graph extends Component {
  componentDidMount() {
    const { canvas, props: { nodes, links, sizes } } = this;
    const { innerWidth, innerHeight } = window;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    camera.position.z = 800;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x333333);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 2000, 0);

    scene.add(spotLight);

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    const rootNode = select(scene);
    const container = rootNode.append("object");

    const nodeGeometry = new THREE.SphereGeometry(5, 10, 10);
    const nodeScale = scaleLinear().range([0.5, 2.25]).domain(sizes);

    const node = container
      .selectAll("node")
      .data(nodes)
      .enter()
      .append("mesh")
      .attr("geometry", nodeGeometry)
      .attr("material", colors)
      .attr("position", () => {
        return { x: 0, y: 0, z: 0 };
      })
      .attr("scale", d => {
        if (d.groups) {
          return { x: 1, y: 1, z: 1 };
        } else {
          const val = nodeScale(d.statSize);
          return { x: val, y: val, z: val };
        }
      });

    const linkMaterial = new THREE.LineBasicMaterial({
      color: 0x999999,
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

    forceSimulation()
      .numDimensions(3)
      .nodes(nodes)
      .force("link", forceLink(links).distance(50).strength(0.25))
      .force("charge", forceManyBody())
      .force("center", forceCenter())
      .on("tick", ticked);

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

    const control = new OrbitControls(camera, canvas);

    function animate() {
      control.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }

  render() {
    return <canvas ref={d => (this.canvas = d)} />;
  }
}

export default Graph;
