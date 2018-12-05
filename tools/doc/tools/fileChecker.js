"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var unist_util_select_1 = require("unist-util-select");
var lev = require("fast-levenshtein");
var ngHelpers = require("../ngHelpers");
var imageFolderPath = path.resolve('docs', 'docassets', 'images');
// Using this value for the edit distance between Markdown image URLs
// and filenames is enough to trap errors like missing out the 'images'
// folder in the path. Keeping it low avoids crazy suggestions.
var maxImagePathLevDistance = 7;
function processDocs(mdCache, aggData, errorMessages) {
    var pathnames = Object.keys(mdCache);
    var classlessDocs = [];
    var linkRefs = {};
    var imageRefs = {};
    var brokenImageRefs = {};
    var filters = makeFilepathFilters(aggData.config["fileCheckerFilter"]);
    pathnames.forEach(function (pathname) {
        var fileBaseName = path.basename(pathname, '.md');
        var tree = mdCache[pathname].mdOutTree;
        var className = ngHelpers.ngNameToClassName(fileBaseName, aggData.config.typeNameExceptions);
        var classInfo = aggData.classInfo[className];
        if (!classInfo) {
            if (!filterFilepath(filters, pathname)) {
                classlessDocs.push(pathname);
            }
        }
        else {
            var linkElems = unist_util_select_1.selectAll('link', tree);
            linkElems.forEach(function (linkElem) {
                var normUrl = normaliseLinkPath(pathname, linkElem.url);
                multiSetAdd(linkRefs, normUrl, pathname);
            });
        }
        var imageElems = unist_util_select_1.selectAll('image', tree);
        imageElems.forEach(function (imageElem) {
            var normUrl = normaliseLinkPath(pathname, imageElem.url);
            multiSetAdd(imageRefs, normUrl, pathname);
            if (!fs.existsSync(normUrl)) {
                brokenImageRefs[normUrl] = pathname;
            }
        });
    });
    classlessDocs.forEach(function (docPath) {
        var relDocPath = docPath.substring(docPath.indexOf('docs'));
        console.group("Warning: no source class found for \"" + relDocPath + "\"");
        if (linkRefs[docPath]) {
            linkRefs[docPath].forEach(function (linkRef) {
                var relLinkPath = linkRef.substring(linkRef.indexOf('docs'));
                console.log("Linked from: \"" + relLinkPath + "\"");
            });
        }
        console.groupEnd();
    });
    console.log();
    var imagePaths = getImagePaths(imageFolderPath);
    imagePaths.forEach(function (imagePath) {
        if (!imageRefs[imagePath]) {
            var relImagePath = imagePath.substring(imagePath.indexOf('docs'));
            console.log("Warning: no links to image file \"" + relImagePath + "\"");
        }
    });
    console.log();
    var brokenImUrls = Object.keys(brokenImageRefs);
    brokenImUrls.forEach(function (url) {
        var relUrl = url.substring(url.indexOf('docs'));
        var relDocPath = brokenImageRefs[url].substring(brokenImageRefs[url].indexOf('docs'));
        console.group("Broken image link \"" + relUrl + "\" found in \"" + relDocPath);
        imagePaths.forEach(function (imPath) {
            if (lev.get(imPath, url) <= maxImagePathLevDistance) {
                var relImPath = imPath.substring(imPath.indexOf('docs'));
                console.log("Should it be \"" + relImPath + "\"?");
            }
        });
        console.groupEnd();
    });
}
exports.processDocs = processDocs;
function normaliseLinkPath(homeFilePath, linkUrl) {
    var homeFolder = path.dirname(homeFilePath);
    return path.resolve(homeFolder, linkUrl);
}
function getImagePaths(imageFolder) {
    var files = fs.readdirSync(imageFolder);
    return files.map(function (f) { return path.resolve(imageFolder, f); });
}
function makeFilepathFilters(regexes) {
    return regexes.map(function (r) { return new RegExp(r); });
}
function filterFilepath(filters, filepath) {
    for (var i = 0; i < filters.length; i++) {
        if (filters[i].test(filepath)) {
            return true;
        }
    }
    return false;
}
function multiSetAdd(container, key, value) {
    if (container[key]) {
        container[key].push(value);
    }
    else {
        container[key] = [value];
    }
}
