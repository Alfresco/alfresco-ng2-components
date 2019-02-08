"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var unist_util_select_1 = require("unist-util-select");
var ngHelpers = require("../ngHelpers");
var angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(dialog)|(directive)|(interface)|(model)|(pipe)|(service)|(widget))/;
function processDocs(mdCache, aggData, errorMessages) {
    var pathnames = Object.keys(mdCache);
    pathnames.forEach(function (pathname) {
        var fileBaseName = path.basename(pathname, '.md');
        if (!fileBaseName.match(angFilenameRegex)) {
            return;
        }
        var tree = mdCache[pathname].mdOutTree;
        var className = ngHelpers.ngNameToClassName(fileBaseName, aggData.config.typeNameExceptions);
        var classInfo = aggData.classInfo[className];
        var sourcePath = classInfo ? classInfo.sourcePath : '';
        var titleHeading = unist_util_select_1.select('heading[depth=1]:first-of-type', tree);
        if (titleHeading.children[0].type === "text") {
            var titleText = titleHeading.children[0];
            titleHeading.children[0] = {
                type: 'link',
                url: "../../" + sourcePath,
                title: "Defined in " + path.basename(sourcePath),
                children: [titleText]
            };
        }
        else if ((titleHeading.children[0].type === "link") && sourcePath) {
            var linkElem = titleHeading.children[0];
            linkElem.url = "../../" + sourcePath;
            linkElem.title = "Defined in " + path.basename(sourcePath);
        }
    });
}
exports.processDocs = processDocs;
