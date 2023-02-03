"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDocs = void 0;
var path = require("path");
var unist_util_select_1 = require("unist-util-select");
var ngHelpers = require("../ngHelpers");
var angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(dialog)|(directive)|(interface)|(model)|(pipe)|(service)|(widget))/;
function processDocs(mdCache, aggData) {
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
        var titleHeading = (0, unist_util_select_1.select)('heading[depth=1]:first-of-type', tree);
        var relDocPath = pathname.substring(pathname.indexOf('docs'));
        var srcUrl = fixRelSrcUrl(relDocPath, sourcePath);
        if (titleHeading && titleHeading.children[0] && titleHeading.children[0].type === 'text') {
            var titleText = titleHeading.children[0];
            titleHeading.children[0] = {
                type: 'link',
                url: srcUrl,
                title: "Defined in ".concat(path.basename(sourcePath)),
                children: [titleText]
            };
        }
        else if ((titleHeading && titleHeading.children[0].type === 'link') && sourcePath) {
            var linkElem = titleHeading.children[0];
            linkElem.url = srcUrl, // `../../${sourcePath}`;
                linkElem.title = "Defined in ".concat(path.basename(sourcePath));
        }
    });
}
exports.processDocs = processDocs;
function fixRelSrcUrl(docPath, srcPath) {
    var docPathSegments = docPath.split(/[\\\/]/);
    var dotPathPart = '';
    for (var i = 0; i < (docPathSegments.length - 1); i++) {
        dotPathPart += '../';
    }
    return dotPathPart + srcPath;
}
