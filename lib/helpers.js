"use strict";

const fs = require("fs");

module.exports = {
  versions(raw) {
    return typeof raw === "string" ? raw.split(".") : [];
  },

  version(raw, flag, reset = false) {
    if (reset) {
      return 0;
    }

    const parsed = parseInt(raw);
    const value = parsed >= 0 ? parsed : 0;
    return flag ? value + 1 : value;
  },

  getPackageInfo(pathToFile) {
    return JSON.parse(fs.readFileSync(pathToFile, "utf8"));
  },

  getBuildNumber(pathToPlist) {
    const content = fs.readFileSync(pathToPlist, "utf8");
    const match = content.match(/(versionCode\s+)([\d\.]+)/);

    if (match && match[2]) {
      return parseInt(match[2]);
    }

    return 1;
  },

  changeVersionInExpoApp(pathToFile, version) {
    let packageContent = fs.readFileSync(pathToFile, "utf8");

    packageContent = packageContent.replace(
      /("version":\s*")([\d\.]+)(")/g,
      `$1${version}$3`
    );
    packageContent = packageContent.replace(
      /("runtimeVersion":\s*")([\d\.]+)(")/g,
      `$1${version}$3`
    );
    fs.writeFileSync(pathToFile, packageContent, "utf8");
  },

  changeVersionInPackage(pathToFile, version) {
    let packageContent = fs.readFileSync(pathToFile, "utf8");
    packageContent = packageContent.replace(
      /("version":\s*")([\d\.]+)(")/g,
      `$1${version}$3`
    );
    fs.writeFileSync(pathToFile, packageContent, "utf8");
  },

  changeVersionAndBuildInPlist(pathToFile, version, build) {
    let content = fs.readFileSync(pathToFile, "utf8");
    content = content.replace(
      /(<key>CFBundleShortVersionString<\/key>\s*<string>)([\d\.]+)(<\/string>)/g,
      `$1${version}$3`
    );
    content = content.replace(
      /(<key>CFBundleVersion<\/key>\s+<string>)([\d\.]+)(<\/string>)/g,
      `$1${version}$3`
    );
    fs.writeFileSync(pathToFile, content, "utf8");
  },

  changeVersionAndBuildInGradle(pathToFile, version, build) {
    let content = fs.readFileSync(pathToFile, "utf8");
    content = content.replace(
      /(\s*versionName\s+["']?)([\d\.]+)(["']?\s*)/g,
      `$1${version}$3`
    );
    content = content.replace(
      /(\s*versionCode\s+["']?)(\d+)(["']?\s*)/g,
      `$1${build}$3`
    );
    fs.writeFileSync(pathToFile, content, "utf8");
  },
};
