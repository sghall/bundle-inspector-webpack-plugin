import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import * as THREE from "three";
import * as d3 from "d3";
import OrbitControls from "../OrbitControls";
import { select } from "subunit";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter
} from "d3-force-3d";
import raycast from "./raycast";
import materials from "./materials";
import processData from "./processData";
import getTexture from "./getTexture";
import { interpolateCubehelixLong } from "d3-interpolate";
const cubhelix = interpolateCubehelixLong("green", "red");

const radius = 800;

class CirclePack extends Component {
  componentWillMount() {
    this.mounted = true;
  }

  componentDidMount() {
    const { canvas, props: { data, colors, updateInfo } } = this;
    const { nodes, links, sizes } = processData(data);
    const { innerWidth, innerHeight } = window;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    camera.position.z = 2000;

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

    const linkColors = {};

    data.forEach((d, i) => {
      linkColors[d.label] = new THREE.LineBasicMaterial({
        color: colors(d.label),
        transparent: false
      });
    });

    const treemap = d3.treemap().round(false);
    const pack = d3.pack().size([1000, 1000]).padding(3);

    const chunks = data.map(d => {
      return {
        size: d.statSize,
        label: d.label
      };
    });

    const x = { groups: data };
    const h = d3
      .hierarchy(x, n => n.groups || null)
      .sum(d => d.statSize)
      .sort((a, b) => {
        return a.value - b.value;
      });

    pack(h);

    console.log(h.descendants());

    const circle = new THREE.SphereGeometry(5, 5, 5);

    const node = container
      .selectAll("node")
      .data(h.descendants())
      .enter()
      .append("mesh")
      .attr("geometry", d => new THREE.CircleBufferGeometry(d.r || 0.0001, 32))
      .attr(
        "material",
        d => new THREE.MeshBasicMaterial({ color: cubhelix(d.depth) })
      )
      // .attr("scale", d => {
      //   return { x: 1, y: 1, z: 0.25 };
      // })
      .attr("position", d => {
        return { x: d.x - 500 || 0, y: d.y - 500 || 0, z: d.depth * 100 };
      });
    // .attr("scale", d => {
    //   if (d.path === "(root)") {
    //     return { x: 1, y: 1, z: 1 };
    //   }

    //   if (d.hasChildren) {
    //     const val = nodeScale.range()[0];
    //     return { x: val / 2, y: val / 2, z: val / 2 };
    //   } else {
    //     const val = nodeScale(d.size);
    //     return { x: val, y: val, z: val };
    //   }
    // })
    // .on("mousemove", updateInfo);

    // const link = container
    //   .selectAll("link")
    //   .data(links)
    //   .enter()
    //   .append("line")
    //   .attr("material", d => {
    //     return linkColors[d.chunkName];
    //   })
    //   .attr("geometry", () => {
    //     const geometry = new THREE.Geometry();
    //     geometry.vertices = [
    //       new THREE.Vector3(0, 0, 0),
    //       new THREE.Vector3(0, 0, 0)
    //     ];

    //     return geometry;
    //   });

    // forceSimulation()
    //   .numDimensions(2)
    //   .nodes(nodes)
    //   .force("link", forceLink(links).distance(20).strength(1.25))
    //   .force("charge", forceManyBody().strength(-50))
    //   .force("center", forceCenter())
    //   .on("end", ticked);

    // function vertex({ x = 0, y = 0 }) {
    //   const l = x * Math.PI / 180;
    //   const p = y * Math.PI / 180;
    //   const c = Math.cos(p);

    //   return {
    //     x: radius * c * Math.cos(l),
    //     y: radius * c * Math.sin(l),
    //     z: radius * Math.sin(p)
    //   };
    // }

    // function resample(coordinates) {
    //   let i = 0;
    //   let j = -1;

    //   const n = coordinates.length;
    //   const source = coordinates.slice();

    //   let p0;
    //   let x0;
    //   let y0;

    //   let p1 = coordinates[0];
    //   let x1 = p1[0];
    //   let y1 = p1[1];

    //   let dx;
    //   let dy;
    //   let d2;

    //   const m2 = 10; // squared minimum angular distance

    //   while (++i < n) {
    //     (p0 = p1), (x0 = x1), (y0 = y1);
    //     (p1 = source[i]), (x1 = p1[0]), (y1 = p1[1]);
    //     (dx = x1 - x0), (dy = y1 - y0), (d2 = dx * dx + dy * dy);
    //     coordinates[++j] = p0;
    //     if (d2 > m2)
    //       for (var k = 1, m = Math.ceil(Math.sqrt(d2 / m2)); k < m; ++k) {
    //         coordinates[++j] = [x0 + dx * k / m, y0 + dy * k / m];
    //       }
    //   }
    //   coordinates[++j] = p1;
    //   coordinates.length = j + 1;
    // }

    // function ticked() {
    //   const xDomain = [Infinity, -Infinity];
    //   const yDomain = [Infinity, -Infinity];
    //   node.each(function(d) {
    //     if (d.x < xDomain[0]) {
    //       xDomain[0] = d.x;
    //     }
    //     if (d.x > xDomain[1]) {
    //       xDomain[1] = d.x;
    //     }
    //     if (d.y < yDomain[0]) {
    //       yDomain[0] = d.y;
    //     }
    //     if (d.y > yDomain[1]) {
    //       yDomain[1] = d.y;
    //     }
    //   });

    //   const xScale = d3.scaleLinear().range([-180, 180]).domain(xDomain);
    //   const yScale = d3.scaleLinear().range([-90, 90]).domain(yDomain);

    //   const chunkScales = {};

    //   h.children.forEach(chunk => {
    //     chunkScales[chunk.data.label] = {};

    //     chunkScales[chunk.data.label].x = d3
    //       .scaleLinear()
    //       .range([360 * chunk.x0 - 180, 360 * chunk.x1 - 180])
    //       .domain([-180, 180]);

    //     chunkScales[chunk.data.label].y = d3
    //       .scaleLinear()
    //       .range([180 * chunk.y0 - 90, 180 * chunk.y1 - 90])
    //       .domain([-90, 90]);
    //   });

    //   console.log(chunkScales);

    //   node.attr("position", d => {
    //     const x = chunkScales[d.chunkName].x;
    //     const y = chunkScales[d.chunkName].y;
    //     return vertex({ x: x(xScale(d.x || 0)), y: y(yScale(d.y || 0)) });
    //   });

    //   link.each(function({ chunkName, source, target }) {
    //     const x = chunkScales[chunkName].x;
    //     const y = chunkScales[chunkName].y;

    //     const coordinates = [
    //       [x(xScale(source.x)), y(yScale(source.y))],
    //       [x(xScale(target.x)), y(yScale(target.y))]
    //     ];

    //     resample(coordinates);
    //     const geo = new THREE.Geometry();
    //     geo.vertices = coordinates.map(point => {
    //       const p = vertex({ x: point[0], y: point[1] });
    //       return new THREE.Vector3(p.x, p.y, p.z);
    //     });
    //     this.geometry = geo;
    //   });
    // }

    const control = new OrbitControls(camera, canvas);
    // this.stopListening = raycast(camera, node.nodes(), "mousemove");

    const animate = () => {
      control.update();

      if (this.mounted === true) {
        requestAnimationFrame(animate);
      }

      renderer.render(scene, camera);
    };

    animate();
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.stopListening) {
      this.stopListening();
    }
  }

  render() {
    return (
      <canvas style={{ marginTop: "-3.25rem" }} ref={d => (this.canvas = d)} />
    );
  }
}

export default CirclePack;
