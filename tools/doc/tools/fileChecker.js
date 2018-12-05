"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var unist_util_select_1 = require("unist-util-select");
var ngHelpers = require("../ngHelpers");
//const angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(directive)|(interface)|(model)|(pipe)|(service)|(widget))/;
var imageFolderPath = path.resolve('docs', 'docassets', 'images');
function processDocs(mdCache, aggData, errorMessages) {
    var pathnames = Object.keys(mdCache);
    var classlessDocs = [];
    var linkRefs = {};
    var imageRefs = {};
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
                if (linkRefs[normUrl]) {
                    linkRefs[normUrl].push(pathname);
                }
                else {
                    linkRefs[normUrl] = [pathname];
                }
            });
        }
        var imageElems = unist_util_select_1.selectAll('image', tree);
        imageElems.forEach(function (imageElem) {
            var normUrl = normaliseLinkPath(pathname, imageElem.url);
            if (imageRefs[normUrl]) {
                imageRefs[normUrl].push(pathname);
            }
            else {
                imageRefs[normUrl] = [pathname];
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
    var imagePaths = getImagePaths(imageFolderPath);
    imagePaths.forEach(function (imagePath) {
        if (!imageRefs[imagePath]) {
            var relImagePath = imagePath.substring(imagePath.indexOf('docs'));
            console.log("Warning: no links to image file \"" + relImagePath + "\"");
        }
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
