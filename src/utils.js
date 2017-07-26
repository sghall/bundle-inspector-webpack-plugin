const path = require("path");

module.exports = {
  getWritePathForSerializedData: (dataPath, contextPath = __dirname) => {
    return path.join(contextPath, "/../app/build", dataPath);
  }
};
