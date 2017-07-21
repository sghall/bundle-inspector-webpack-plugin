const httpServer = require("http-server");
const openPort = require("openport");
const { VIZ_PATH } = require("./utils");
const path = require("path");
const opn = require("opn");

module.exports = function launchServer(dataPath, contextPath) {
  openPort.find((err, port) => {
    if (err != null) {
      console.log(err);
      process.exit(1);
    }

    httpServer
      .createServer({
        root: path.join(contextPath, VIZ_PATH)
      })
      .listen(port, "0.0.0.0", () => {
        console.log(`Server running on port ${port}`);
        console.log(`Press Control+C to Quit`);
        opn(`http://localhost:${port}?file=${dataPath}`);
      });
  });
};
