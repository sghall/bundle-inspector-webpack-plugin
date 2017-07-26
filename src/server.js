const openPort = require("openport");
const express = require("express");
const http = require("http");
const path = require("path");
const opn = require("opn");
const ws = require("ws");
const { yellow } = require("chalk");

module.exports = function launchServer(dataFile) {
  const app = express();

  app.use(express.static(path.join(__dirname, "/../app/build")));
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/../app/build", "index.html"));
  });

  const server = http.createServer(app);

  let CM_PORT;

  openPort.find((err, port) => {
    if (err != null) {
      console.log(err);
      process.exit(1);
    }

    CM_PORT = port;

    server.listen(port, () => {
      console.log(
        yellow(`Chunky Monkey: http://localhost:${port}?file=${dataFile}`)
      );
      console.log(yellow(`Chunky Monkey: Control+C to Quit`));
      opn(`http://localhost:${port}?file=${dataFile}`);
    });
  });

  const wss = new ws.Server({ server });

  function update(d) {
    console.log(yellow(`Chunky Monkey: http://localhost:${CM_PORT}?file=${d}`));
    wss.clients.forEach(c => {
      if (c.readyState === ws.OPEN) {
        c.send(d);
      }
    });

    return update;
  }

  return update;
};
