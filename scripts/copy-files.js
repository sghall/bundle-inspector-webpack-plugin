// @flow weak
/* eslint-disable no-console */

const fse = require("fs-extra");
const path = require("path");

function copyFile(file) {
  const buildPath = path.resolve(__dirname, "../build/", path.basename(file));
  return new Promise(resolve => {
    fse.copy(file, buildPath, err => {
      if (err) throw err;
      resolve();
    });
  }).then(() => console.log(`Copied ${file} to ${buildPath}`));
}

function createPackageFile() {
  return new Promise(resolve => {
    fse.readFile(
      path.resolve(__dirname, "../package.json"),
      "utf8",
      (err, data) => {
        if (err) {
          throw err;
        }

        resolve(data);
      }
    );
  })
    .then(data => JSON.parse(data))
    .then(packageData => {
      const {
        author,
        version,
        description,
        keywords,
        repository,
        license,
        bugs,
        bin,
        homepage,
        peerDependencies,
        dependencies
      } = packageData;

      const minimalPackage = {
        name: "chunky-monkey",
        author,
        version,
        description,
        keywords,
        repository,
        license,
        bugs,
        bin,
        homepage,
        peerDependencies,
        dependencies
      };

      return new Promise(resolve => {
        const buildPath = path.resolve(__dirname, "../build/package.json");
        const data = JSON.stringify(minimalPackage, null, 2);
        fse.writeFile(buildPath, data, err => {
          if (err) throw err;
          console.log(`Created package.json in ${buildPath}`);
          resolve();
        });
      });
    });
}

const files = ["README.md", "LICENSE"];

Promise.all(files.map(file => copyFile(file)))
  .then(() => createPackageFile())
  .then(() => {
    const src = path.resolve(__dirname, "../app/build");
    const trg = path.resolve(__dirname, "../build/app/build");
    return fse.copy(src, trg);
  })
  .then(() => {
    const src = path.resolve(__dirname, "../cli");
    const trg = path.resolve(__dirname, "../build/cli");
    return fse.copy(src, trg);
  })
  .then(() => {
    const src = path.resolve(__dirname, "../bin.js");
    const trg = path.resolve(__dirname, "../build/bin.js");
    return fse.copy(src, trg);
  });
