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
            var link = resolveTypeLink(aggData, node.value);
            if (link) {
                convertNodeToTypeLink(node, node.value, link);
            }
        }
        else if (node.type === "link") {
            if (node.children && ((node.children[0].type === "inlineCode") ||
                (node.children[0].type === "text"))) {
                var link = resolveTypeLink(aggData, node.children[0].value);
                if (link) {
                    convertNodeToTypeLink(node, node.children[0].value, link);
                }
            }
        }
        else if (node.type === "paragraph") {
            node.children.forEach(function (child, index) {
                if (child.type === "text") {
                    var newNodes = handleLinksInBodyText(aggData, child.value);
                    node.children = node.children.slice(0, index).concat(newNodes, node.children.slice(index + 1));
                }
                else {
                    traverseMDTree(child);
                }
            });
        }
        else if (node.children) {
            node.children.forEach(function (child) {
                traverseMDTree(child);
            });
        }
    }
}
exports.updatePhase = updatePhase;
var WordScanner = /** @class */ (function () {
    function WordScanner(text) {
        this.text = text;
        this.index = -1;
        this.nextIndex = 0;
        this.next();
    }
    WordScanner.prototype.finished = function () {
        return this.index >= this.text.length;
    };
    WordScanner.prototype.next = function () {
        this.index = this.nextIndex + 1;
        this.nextIndex = this.text.indexOf(" ", this.index);
        if (this.nextIndex === -1) {
            this.nextIndex = this.text.length;
        }
        this.current = this.text.substring(this.index, this.nextIndex);
    };
    return WordScanner;
}());
function handleLinksInBodyText(aggData, text) {
    var result = [];
    var currTextStart = 0;
    for (var scanner = new WordScanner(text); !scanner.finished(); scanner.next()) {
        var word = scanner.current
            .replace(/'s$/, "")
            .replace(/^[;:,\."']+/g, "")
            .replace(/[;:,\."']+$/g, "");
        var link = resolveTypeLink(aggData, word);
        if (link) {
            var linkNode = unist.makeLink(unist.makeText(scanner.current), link);
            var prevText = text.substring(currTextStart, scanner.index);
            result.push(unist.makeText(prevText));
            result.push(linkNode);
            currTextStart = scanner.nextIndex;
        }
    }
    var remainingText = text.substring(currTextStart, text.length);
    if (remainingText) {
        result.push(unist.makeText(remainingText));
    }
    return result;
}
function resolveTypeLink(aggData, text) {
    var possClassName = cleanClassName(text);
    var ref = aggData.projData.findReflectionByName(possClassName);
    if (ref && isLinkable(ref.kind)) {
        var kebabName = ngHelpers.kebabifyClassName(possClassName);
        var possDocFile = aggData.docFiles[kebabName];
        var url = "../../lib/" + ref.sources[0].fileName;
        if (possDocFile) {
            url = "../" + possDocFile;
        }
        return url;
    }
    else {
        return "";
    }
}
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
