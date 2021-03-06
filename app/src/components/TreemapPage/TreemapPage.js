import React, { Component } from "react";
import * as d3 from "d3";
import processData from "./processData";
import { formatBytes } from "../utils";
import "./treemap.css";

class TreemapPage extends Component {
  componentDidMount() {
    const { container, props: { data, colors } } = this;
    const tree = processData(data);

    const view = [960, 500];
    const trbl = [20, 0, 0, 0];
    const dims = [view[0] - trbl[1] - trbl[3], view[1] - trbl[0] - trbl[2]];

    const x = d3.scaleLinear().domain([0, dims[0]]).range([0, dims[0]]);
    const y = d3.scaleLinear().domain([0, dims[1]]).range([0, dims[1]]);

    const treemap = d3.treemap().round(false);

    const svg = d3
      .select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${view[0]} ${view[1]}`)
      .append("g")
      .attr("transform", `translate(${trbl[3]},${trbl[0]})`)
      .style("shape-rendering", "crispEdges");

    const grandparent = svg.append("g").attr("class", "grandparent");

    grandparent
      .append("rect")
      .attr("y", -trbl[0])
      .attr("width", dims[0])
      .attr("height", trbl[0]);

    grandparent
      .append("text")
      .attr("x", 6)
      .attr("y", 6 - trbl[0])
      .attr("dy", ".75em");

    initialize(tree);
    layout(tree);
    display(tree);

    function initialize(d) {
      d.x = d.y = 0;
      d.dx = dims[0];
      d.dy = dims[1];
      d.depth = 0;
    }

    function layout(d) {
      if (d.children) {
        const x = { children: d.children };
        const h = d3
          .hierarchy(x, n => n.children || null)
          .sum(d => d.size)
          .sort((a, b) => {
            return a.value - b.value;
          });

        treemap(h);

        h.children.forEach(function(c) {
          c.data.x = d.x + c.x0 * d.dx;
          c.data.y = d.y + c.y0 * d.dy;
          c.data.dx = c.x1 - c.x0;
          c.data.dy = c.y1 - c.y0;
          c.data.dx *= d.dx;
          c.data.dy *= d.dy;
          c.data.parent = d;
          layout(c.data);
        });
      }
    }

    function display(d) {
      grandparent
        .datum(d.parent)
        .on("click", transition)
        .select("text")
        .text(name(d));

      var g1 = svg.insert("g", ".grandparent").datum(d).attr("class", "depth");
      var g = g1.selectAll("g").data(d.children).enter().append("g");

      g
        .filter(d => d.children)
        .classed("children", true)
        .on("click", transition);

      g
        .selectAll(".child")
        .data(d => d.children || [d])
        .enter()
        .append("rect")
        .attr("class", "child")
        .attr("fill", d => colors(d.chunkName))
        .call(rect);

      g
        .append("rect")
        .attr("id", d => `node-${d.name.replace(/\W+/g, "-")}`)
        .attr("fill", "rgba(255, 255, 255, 0.05)")
        .call(rect);

      g
        .append("clipPath")
        .attr("id", d => `clip-${d.name.replace(/\W+/g, "-")}`)
        .append("use")
        .attr("xlink:href", d => `#node-${d.name.replace(/\W+/g, "-")}`);

      g
        .append("text")
        .attr("clip-path", d => `url(#clip-${d.name.replace(/\W+/g, "-")})`)
        .attr("dy", ".75em")
        .text(d => `${d.name} (${formatBytes(d.size)})`)
        .call(text);

      let transitioning;

      function transition(d) {
        if (transitioning || !d) return;
        transitioning = true;

        const g2 = display(d);
        const t1 = g1.transition().duration(750);
        const t2 = g2.transition().duration(750);

        x.domain([d.x, d.x + d.dx]);
        y.domain([d.y, d.y + d.dy]);

        svg.style("shape-rendering", null);

        svg.selectAll(".depth").sort((a, b) => {
          return a.depth - b.depth;
        });

        g2.selectAll("text").style("fill-opacity", 0);

        t1.selectAll("text").call(text).style("fill-opacity", 0);
        t2.selectAll("text").call(text).style("fill-opacity", 1);
        t1.selectAll("rect").call(rect);
        t2.selectAll("rect").call(rect);

        t1.remove().each(() => {
          svg.style("shape-rendering", "crispEdges");
          transitioning = false;
        });
      }

      return g;
    }

    function text(text) {
      text.attr("x", d => x(d.x) + 6).attr("y", d => y(d.y) + 6);
    }

    function rect(rect) {
      rect
        .attr("x", d => x(d.x))
        .attr("y", d => y(d.y))
        .attr("width", d => x(d.x + d.dx) - x(d.x))
        .attr("height", d => y(d.y + d.dy) - y(d.y));
    }

    function name(d) {
      return d.parent ? name(d.parent) + "/" + d.name : d.name;
    }
  }

  render() {
    return <div ref={d => (this.container = d)} />;
  }
}

export default TreemapPage;
