import React, { Component } from "react";
// import { format } from "d3-format";
// import { scaleLinear } from "d3-scale";
// import { treemap, hierarchy } from "d3-hierarchy";
// import { select } from "d3-selection";
import * as d3 from "d3";
import flare from "./flare.json";
import "./treemap.css";

class Treemap extends Component {
  componentDidMount() {
    const { container, props: { data } } = this;

    const margin = { top: 20, right: 0, bottom: 0, left: 0 };
    const width = 960;
    const height = 500 - margin.top - margin.bottom;
    const formatNumber = d3.format(",d");

    let transitioning;

    const x = d3.scaleLinear().domain([0, width]).range([0, width]);
    const y = d3.scaleLinear().domain([0, height]).range([0, height]);

    var tree = d3.treemap().round(false);

    var svg = d3
      .select(container)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .style("margin-left", -margin.left + "px")
      .style("margin.right", -margin.right + "px")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("shape-rendering", "crispEdges");

    var grandparent = svg.append("g").attr("class", "grandparent");

    grandparent
      .append("rect")
      .attr("y", -margin.top)
      .attr("width", width)
      .attr("height", margin.top);

    grandparent
      .append("text")
      .attr("x", 6)
      .attr("y", 6 - margin.top)
      .attr("dy", ".75em");

    // const tree = hierarchy(data);

    // initialize(root);
    // setChildren(data);
    // // display(data);
    // const nodes = hierarchy(data).sum(d => d.value);
    // console.log(tree(hierarchy({ children: data.children }).sum(d => d.value)));

    initialize(flare);
    layout(flare);
    display(flare);

    function initialize(d) {
      d.x = d.y = 0;
      d.dx = width;
      d.dy = height;
      d.depth = 0;
    }

    function layout(d) {
      if (d.children) {
        const x = { children: d.children };
        const h = d3
          .hierarchy(x, n => n.children || null)
          .sum(d => d.value)
          .sort((a, b) => {
            return a.value - b.value;
          });

        tree(h);

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

    console.log(flare);

    function display(d) {
      grandparent
        .datum(d.parent)
        .on("click", transition)
        .select("text")
        .text(name(d));

      var g1 = svg.insert("g", ".grandparent").datum(d).attr("class", "depth");
      var g = g1.selectAll("g").data(d.children).enter().append("g");

      g
        .filter(function(d) {
          return d.children;
        })
        .classed("children", true)
        .on("click", transition);

      g
        .selectAll(".child")
        .data(function(d) {
          return d.children || [d];
        })
        .enter()
        .append("rect")
        .attr("class", "child")
        .call(rect);

      g
        .append("rect")
        .attr("class", "parent")
        .call(rect)
        .append("title")
        .text(function(d) {
          return formatNumber(d.value);
        });

      g
        .append("text")
        .attr("dy", ".75em")
        .text(function(d) {
          return d.name;
        })
        .call(text);

      function transition(d) {
        if (transitioning || !d) return;
        transitioning = true;

        var g2 = display(d),
          t1 = g1.transition().duration(750),
          t2 = g2.transition().duration(750);

        x.domain([d.x, d.x + d.dx]);
        y.domain([d.y, d.y + d.dy]);

        svg.style("shape-rendering", null);

        svg.selectAll(".depth").sort(function(a, b) {
          return a.depth - b.depth;
        });

        g2.selectAll("text").style("fill-opacity", 0);

        t1.selectAll("text").call(text).style("fill-opacity", 0);
        t2.selectAll("text").call(text).style("fill-opacity", 1);
        t1.selectAll("rect").call(rect);
        t2.selectAll("rect").call(rect);

        t1.remove().each(function() {
          svg.style("shape-rendering", "crispEdges");
          transitioning = false;
        });
      }

      return g;
    }

    function text(text) {
      text
        .attr("x", function(d) {
          return x(d.x) + 6;
        })
        .attr("y", function(d) {
          return y(d.y) + 6;
        });
    }

    function rect(rect) {
      rect
        .attr("x", function(d) {
          return x(d.x);
        })
        .attr("y", function(d) {
          return y(d.y);
        })
        .attr("width", function(d) {
          return x(d.x + d.dx) - x(d.x);
        })
        .attr("height", function(d) {
          return y(d.y + d.dy) - y(d.y);
        });
    }

    function name(d) {
      return d.parent ? name(d.parent) + "." + d.name : d.name;
    }
  }

  render() {
    return <div ref={d => (this.container = d)} />;
  }
}

export default Treemap;
