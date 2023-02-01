"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDocs = void 0;
var path = require("path");
var fs = require("fs");
var unist_util_select_1 = require("unist-util-select");
var suffixesNotToCheck = /\.ts/;
function processDocs(mdCache, aggData) {
    var pathnames = Object.keys(mdCache);
    var linkSet = new LinkSet(pathnames);
    var imageFolderPath = path.resolve(aggData['rootFolder'], 'docs', 'docassets', 'images');
    var imageSet = new LinkSet(getImagePaths(imageFolderPath));
    pathnames.forEach(function (pathname) {
        var tree = mdCache[pathname].mdOutTree;
        fixUrls(tree, pathname, linkSet, 'link');
        fixUrls(tree, pathname, imageSet, 'image');
    });
}
exports.processDocs = processDocs;
function fixUrls(tree, docFilePath, linkSet, selector) {
    var linksInDoc = (0, unist_util_select_1.selectAll)(selector, tree);
    var errors = [];
    linksInDoc.forEach(function (linkElem) {
        var origFullUrlPath = path.resolve(path.dirname(docFilePath), linkElem.url);
        var hashPos = origFullUrlPath.indexOf('#');
        var anchor = '';
        if (hashPos !== -1) {
            anchor = origFullUrlPath.substring(hashPos);
            origFullUrlPath = origFullUrlPath.substring(0, hashPos);
        }
        if (!linkElem.url.match(/http:|https:|ftp:|mailto:/) &&
            !path.extname(origFullUrlPath).match(suffixesNotToCheck) &&
            (origFullUrlPath !== '') &&
            !fs.existsSync(origFullUrlPath)) {
            var newUrl = linkSet.update(origFullUrlPath) || origFullUrlPath;
            linkElem.url = path.relative(path.dirname(docFilePath), newUrl).replace(/\\/g, '/') + anchor;
            errors.push("Bad link: ".concat(origFullUrlPath, "\nReplacing with ").concat(linkElem.url));
        } /*else {
            console.log(`Link OK: ${origFullUrlPath}`);
        }
        */
    });
    if (errors.length > 0) {
        showMessages("File: ".concat(docFilePath, ":"), errors);
    }
}
function showMessages(groupName, messages) {
    console.group(groupName);
    messages.forEach(function (message) {
        console.log(message);
    });
    console.groupEnd();
}
function getImagePaths(imageFolderPath) {
    return fs.readdirSync(imageFolderPath)
        .map(function (imageFileName) { return path.resolve(imageFolderPath, imageFileName); });
}
var LinkSet = /** @class */ (function () {
    function LinkSet(urls) {
        var _this = this;
        this.links = new Map();
        urls.forEach(function (url) {
            var fileName = path.basename(url);
            if (_this.links.has(fileName)) {
                var item = _this.links.get(fileName);
                item.push(url);
            }
            else {
                _this.links.set(fileName, [url]);
            }
        });
    }
    LinkSet.prototype.update = function (oldUrl) {
        var oldFileName = path.basename(oldUrl);
        if (!this.links.has(oldFileName)) {
            return '';
        }
        else {
            var candidates = this.links.get(oldFileName);
            if (candidates.length === 1) {
                return candidates[0];
            }
            else {
                console.log("Multiple candidates for ".concat(oldUrl));
                return '';
            }
        }
    };
    return LinkSet;
}());
