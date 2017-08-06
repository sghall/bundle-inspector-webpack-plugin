import * as THREE from "three";
import * as d3 from "d3";

export default function mapTexture(chunks, colors) {
  var texture, ctx, canvas;

  canvas = d3
    .select("body")
    .append("canvas")
    .style("display", "none")
    .attr("width", "2048px")
    .attr("height", "1024px");

  ctx = canvas.node().getContext("2d");

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;

  chunks.children.forEach(chunk => {
    const color = colors(chunk.data.label);
    console.log(color);
    ctx.fillStyle = "grey"; // color;

    const w = (chunk.x1 - chunk.x0) * 2048;
    const h = (chunk.y1 - chunk.y0) * 1024;
    ctx.fillRect(chunk.x0 * 2048, chunk.y0 * 1024, w, h);
  });

  // console.log(canvas.node().toDataURL());

  texture = new THREE.Texture(canvas.node());
  texture.needsUpdate = true;

  canvas.remove();
  console.log(texture);
  return texture;
}
