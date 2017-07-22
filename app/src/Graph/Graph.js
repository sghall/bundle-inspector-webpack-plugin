import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import { interpolateCubehelixLong } from "d3-interpolate";
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
import raycast from "./raycast";

const cubhelix = interpolateCubehelixLong("blue", "red");

class Graph extends Component {
  componentDidMount() {
    const { canvas, props: { names, nodes, links, sizes, updateStats } } = this;
    const { innerWidth, innerHeight } = window;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000);

    const aboveSpot = new THREE.SpotLight(0xffffbb);
    aboveSpot.position.set(0, 1000, 0);
    scene.add(aboveSpot);

    const belowSpot = new THREE.SpotLight(0xffffbb);
    belowSpot.position.set(0, -1000, 0);
    scene.add(belowSpot);

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
        if (!d.path) {
          return { x: 1, y: 1, z: 1 };
        }

        if (d.groups) {
          const val = nodeScale.range()[0];
          return { x: val / 2, y: val / 2, z: val / 2 };
        } else {
          const val = nodeScale(d.statSize);
          return { x: val, y: val, z: val };
        }
      })
      .on("mousemove", updateStats);

    const colorScale = scaleLinear()
      .range([0.1, 0.9])
      .domain([0, names.length - 1]);

    const linkColors = {};

    names.forEach((d, i) => {
      linkColors[d.label] = new THREE.LineBasicMaterial({
        color: cubhelix(colorScale(i)),
        transparent: false
      });
    });

    const link = container
      .selectAll("link")
      .data(links)
      .enter()
      .append("line")
      .attr("material", d => {
        return linkColors[d.chunkName];
      })
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
      .force("link", forceLink(links).distance(20).strength(1.5))
      .force("charge", forceManyBody().strength(-20))
      .force("center", forceCenter())
      .on("tick", ticked);

    function ticked() {
      node.attr("position", ({ x = 0, y = 0, z = 0 }) => {
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
    raycast(camera, node.nodes(), "mousemove");

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
