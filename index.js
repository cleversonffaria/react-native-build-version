"use strict";

const fs = require("fs");
const argv = require("yargs").argv;

const helpers = require("./lib/helpers");
const log = require("./lib/log");

const pathToRoot = process.cwd();
const pathToPackage = argv.pathToPackage || `${pathToRoot}/package.json`;
const info = helpers.getPackageInfo(pathToPackage);

const pathToExpoApp = `${pathToRoot}/app.json`;
const pathToPlist =
  argv.pathToPlist || `${pathToRoot}/ios/${info.name}/Info.plist`;
const pathToGradle =
  argv.pathToGradle || `${pathToRoot}/android/app/build.gradle`;
// handle case of several plist files
const pathsToPlists = Array.isArray(pathToPlist) ? pathToPlist : [pathToPlist];

// getting next version
const versionCurrent = info.version;
const versions = helpers.versions(versionCurrent);
let major = helpers.version(versions[0], argv.major);
let minor = helpers.version(versions[1], argv.minor, argv.major);
let patch = helpers.version(versions[2], argv.patch, argv.major || argv.minor);
const version = `${major}.${minor}.${patch}`;

// getting next build number
const buildCurrent = helpers.getBuildNumber(pathToGradle);
const build = buildCurrent + 1;

// getting commit message
const messageTemplate =
  argv.m ||
  argv.message ||
  "release ${version}: increase versions and build numbers";
const message = messageTemplate.replace("${version}", version);

log.info("\nI'm going to increase the version in:");
log.info(`- app.json (${pathToExpoApp});`, 1);
log.info(`- package.json (${pathToPackage});`, 1);
log.info(`- ios project (${pathsToPlists.join(", ")});`, 1);
log.info(`- android project (${pathToGradle}).`, 1);

log.notice(`\nThe version will be changed:`);
log.notice(`- from: ${versionCurrent} (${buildCurrent});`, 1);
log.notice(`- to:   ${version} (${build}).`, 1);

if (version === versionCurrent) {
  log.warning("\nNothing to change in the version. Canceled.");
  process.exit();
}

const chain = new Promise((resolve, reject) => {
  log.line();

  if (versions.length !== 3) {
    log.warning(
      `I can\'t understand format of the version "${versionCurrent}".`
    );
  }
  resolve();
});

const update = chain
  .then(() => {
    log.info("\nUpdating version...", 1);

    helpers.changeVersionInPackage(pathToPackage, version);
    helpers.changeVersionInExpoApp(pathToExpoApp, version);
    log.success(`Version in package.json changed.`, 2);
    log.notice(`version = ${version}`, 2);
    log.success(`Version in app.json changed.`, 2);
    log.notice(`version = ${version}`, 2);
    log.notice(`runtimeVersion = ${version}`, 2);
  })
  .then(() => {
    log.info("\nUpdating version in xcode project...", 1);

    pathsToPlists.forEach((pathToPlist) => {
      helpers.changeVersionAndBuildInPlist(pathToPlist, version, build);
    });
    log.success(
      `Version and build number in ios project (plist file) changed.`,
      2
    );
    log.notice(`versionName = ${version}`, 2);
    log.notice(`versionCode = ${version}`, 2);
  })
  .then(() => {
    log.info("\nUpdating version in android project...", 1);

    helpers.changeVersionAndBuildInGradle(pathToGradle, version, build);
    log.success(
      `Version and build number in android project (gradle file) changed.`,
      2
    );
    log.notice(`versionName = ${version}`, 2);
    log.notice(`versionCode = ${build}`, 2);
  });

const commit = update.then(() => {
  log.warning(`Skipped.`, 1);
});

commit
  .then(() => {
    log.success(`\nDone!`);
  })
  .catch((e) => {
    log.line();
    log.error(e);
  });
