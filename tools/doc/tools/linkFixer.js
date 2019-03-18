"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var unist_util_select_1 = require("unist-util-select");
var angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(dialog)|(directive)|(interface)|(model)|(pipe)|(service)|(widget))/;
var suffixesNotToCheck = /\.ts/;
function processDocs(mdCache, aggData, errorMessages) {
    var pathnames = Object.keys(mdCache);
    var linkSet = new LinkSet(pathnames);
    var imageFolderPath = path.resolve(aggData['rootFolder'], 'docassets', 'images');
    var imageSet = new LinkSet(getImagePaths(imageFolderPath));
    pathnames.forEach(function (pathname) {
        var fileBaseName = path.basename(pathname, '.md');
        if (!fileBaseName.match(angFilenameRegex)) {
            return;
        }
        var tree = mdCache[pathname].mdOutTree;
        //fixUrls(tree, pathname, linkSet, 'link');
        fixUrls(tree, pathname, imageSet, 'image');
    });
}
exports.processDocs = processDocs;
function fixUrls(tree, docFilePath, linkSet, selector) {
    var linksInDoc = unist_util_select_1.selectAll(selector, tree);
    console.log("File: " + docFilePath + ":");
    linksInDoc.forEach(function (linkElem) {
        var origFullUrlPath = path.resolve(path.dirname(docFilePath), linkElem.url);
        if (!linkElem.url.match(/http:|https:|ftp:|mailto:/) &&
            !path.extname(linkElem.url).match(suffixesNotToCheck) &&
            !fs.existsSync(origFullUrlPath)) {
            var newUrl = linkSet.update(origFullUrlPath) || origFullUrlPath;
            linkElem.url = path.relative(path.dirname(docFilePath), newUrl).replace(/\\/g, '/');
            console.log("Bad link: " + origFullUrlPath);
            console.log("Replacing with " + linkElem.url);
        }
        else {
            console.log("Link OK: " + origFullUrlPath);
        }
    });
}
/*
function fixImages(tree: MDAST.Root, docFilePath: string, imageMap: Map<string, string>) {
    let imagesInDoc = selectAll('image', tree);

    console.log(`File: ${docFilePath}:`);

    imagesInDoc.forEach(image => {
        let imageElem: MDAST.Image = image;
        let origFullUrlPath = path.resolve(path.dirname(docFilePath), imageElem.u);

        if (!linkElem.url.match(/http:|https:|ftp:|mailto:/) &&
            path.extname(linkElem.url) === '.md' &&
            !fs.existsSync(origFullUrlPath)
        ) {
            let newUrl = linkSet.update(origFullUrlPath) || origFullUrlPath;
            linkElem.url = path.relative(path.dirname(docFilePath), newUrl);
            console.log(`Bad link: ${origFullUrlPath}`)
            console.log(`Replacing with ${linkElem.url}`);
        } else {
            console.log(`Link OK: ${origFullUrlPath}`);
        }
    });
}
*/
function getImagePaths(imageFolderPath) {
    /*
    let result = new Map<string, string>();

    let imageFileNames = fs.readdirSync(imageFolderPath);

    imageFileNames.forEach(imageFileName => {
        let fullImagePath = ;
        result.set(imageFileName, fullImagePath);
    });
    */
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
                console.log("Multiple candidates for " + oldUrl);
                return '';
            }
        }
    };
    return LinkSet;
}());
