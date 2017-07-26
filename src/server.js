const httpServer = require("http-server");
const openPort = require("openport");
const path = require("path");
const opn = require("opn");

const APP_DIST = "/../app/build";

module.exports = function launchServer(dataPath, contextPath = __dirname) {
  openPort.find((err, port) => {
    if (err != null) {
      console.log(err);
      process.exit(1);
    }

    console.log(path.join(contextPath, APP_DIST));

    httpServer
      .createServer({
        root: path.join(contextPath, APP_DIST)
      })
      .listen(port, "0.0.0.0", () => {
        console.log(`Server running on port ${port}`);
        console.log(`Press Control+C to Quit`);
        opn(`http://localhost:${port}?file=${dataPath}`);
      });
  });
};
