"use strict";
exports.__esModule = true;
var path = require("path");
var fs = require("fs");
var typedoc_1 = require("typedoc");
var unist = require("../unistHelpers");
var ngHelpers = require("../ngHelpers");
var includedNodeTypes = [
    "root", "paragraph", "inlineCode", "list", "listItem",
    "table", "tableRow", "tableCell", "emphasis", "strong",
    "link", "text"
];
var docFolder = path.resolve("..", "docs");
var adfLibNames = ["core", "content-services", "insights", "process-services"];
function initPhase(aggData) {
    aggData.docFiles = {};
    adfLibNames.forEach(function (libName) {
        var libFolderPath = path.resolve(docFolder, libName);
        var files = fs.readdirSync(libFolderPath);
        files.forEach(function (file) {
            if (path.extname(file) === ".md") {
                var relPath = libFolderPath.substr(libFolderPath.indexOf("docs") + 5).replace(/\\/, "/") + "/" + file;
                var compName = path.basename(file, ".md");
                aggData.docFiles[compName] = relPath;
            }
        });
    });
}
exports.initPhase = initPhase;
function readPhase(tree, pathname, aggData) { }
exports.readPhase = readPhase;
function aggPhase(aggData) {
}
exports.aggPhase = aggPhase;
function updatePhase(tree, pathname, aggData) {
    traverseMDTree(tree);
    return true;
    function traverseMDTree(node) {
        if (!includedNodeTypes.includes(node.type)) {
            return;
        }
        if (node.type === "inlineCode") {
            var possClassName = cleanClassName(node.value);
            var ref = aggData.projData.findReflectionByName(possClassName);
            if (ref && isLinkable(ref.kind)) {
                var kebabName = ngHelpers.kebabifyClassName(possClassName);
                console.log(kebabName);
                var possDocFile = aggData.docFiles[kebabName];
                var url = "../../lib/" + ref.sources[0].fileName;
                if (possDocFile) {
                    url = "../" + possDocFile;
                }
                convertNodeToTypeLink(node, node.value, url);
            }
        }
        else if (node.type === "link") {
            if (node.children && ((node.children[0].type === "inlineCode") ||
                (node.children[0].type === "text"))) {
                var possClassName = cleanClassName(node.children[0].value);
                var ref = aggData.projData.findReflectionByName(possClassName);
                if (ref && isLinkable(ref.kind)) {
                    var kebabName = ngHelpers.kebabifyClassName(possClassName);
                    console.log(kebabName);
                    var possDocFile = aggData.docFiles[kebabName];
                    var url = "../../lib/" + ref.sources[0].fileName;
                    if (possDocFile) {
                        url = "../" + possDocFile;
                    }
                    convertNodeToTypeLink(node, node.children[0].value, url);
                }
            }
        }
        else if (node.children) {
            node.children.forEach(function (element) {
                traverseMDTree(element);
            });
        }
    }
}
exports.updatePhase = updatePhase;
function cleanClassName(text) {
    var matches = text.match(/[a-zA-Z0-9_]+<([a-zA-Z0-9_]+)>/);
    if (matches) {
        return matches[1];
    }
    else {
        return text;
    }
}
function isLinkable(kind) {
    return (kind === typedoc_1.ReflectionKind.Class) ||
        (kind === typedoc_1.ReflectionKind.Interface) ||
        (kind === typedoc_1.ReflectionKind.Enum);
}
function convertNodeToTypeLink(node, text, url) {
    var linkDisplayText = unist.makeInlineCode(text);
    node.type = "link";
    node.url = url;
    node.children = [linkDisplayText];
}
