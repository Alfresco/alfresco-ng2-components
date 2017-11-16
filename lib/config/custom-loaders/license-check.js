var path = require('path');
var loaderUtils = require('loader-utils');
var fs = require('fs');

var licenseFileUtf8Store = undefined;

function readLicenseHeaderFile(licenseFilePath) {
    if (licenseFileUtf8Store) {
        return licenseFileUtf8Store;
    }

    if (fs.existsSync(licenseFilePath)) {
        licenseFileUtf8Store = fs.readFileSync(licenseFilePath, 'utf8').split(/\r?\n/);
        return licenseFileUtf8Store;
    }

    throw new Error('The license header file path is wrong ' + licenseFilePath);
}

function isFileEmpty(fileContents) {
    return fileContents.toString('utf8').trim() === '';
}

function readCurrentFile(fileContent) {
    return fileContent.toString('utf8').split(/\r?\n/);
}

function isLicenseHeaderPresent(currentFileContent, licenseFilePath) {
    if (!isFileEmpty(currentFileContent)) {
        var currentFileUtf8 = readCurrentFile(currentFileContent),
            licenseFileUtf8 = readLicenseHeaderFile(licenseFilePath);
            skipStrict = 0;

        if(currentFileUtf8[0] === '"use strict";' ) {
            skipStrict = 1;
        }

        for (var i = skipStrict; i < licenseFileUtf8.length; i++) {
            if (currentFileUtf8[i + skipStrict] !== licenseFileUtf8[i]) {
                return false;
            }
        }
    }
    return true;
}

function report(hasHeader, emitter, filename) {
  if (hasHeader) return;
  emitter('Missing license header file : ' + filename);
}

function licenseCheck(webpackInstance, input, options) {
    var isLicensePresent =  isLicenseHeaderPresent(input, options.licenseFile);

    var emitter = options.emitErrors ? webpackInstance.emitError : webpackInstance.emitWarning;

    report(isLicensePresent, emitter, webpackInstance.resourcePath);
}

module.exports = function(input, map) {
  this.cacheable && this.cacheable();
  var callback = this.async();

  var options = loaderUtils.getOptions(this);
  licenseCheck(this, input, options);
  callback(null, input, map);
};
