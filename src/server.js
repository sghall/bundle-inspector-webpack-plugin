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

  openPort.find((err, port) => {
    if (err != null) {
      console.log(err);
      process.exit(1);
    }

    server.listen(port, () => {
      console.log(yellow(`Chunky Monkey listening on port ${port}`));
      console.log(yellow(`Press Control+C to Quit`));
      opn(`http://localhost:${port}?file=${dataFile}`);
    });
  });

  const wss = new ws.Server({ server });

  function update(d) {
    wss.clients.forEach(c => {
      console.log(yellow(`Chunky Monkey: ${d}`));
      if (c.readyState === ws.OPEN) {
        c.send(d);
      }
    });

    return update;
  }

  return update;
};
