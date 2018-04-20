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
    aggData.nameLookup = new SplitNameLookup();
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
    var classes = aggData.projData.getReflectionsByKind(typedoc_1.ReflectionKind.Class);
    classes.forEach(function (currClass) {
        if (currClass.name.match(/(Component|Directive|Interface|Model|Pipe|Service|Widget)$/)) {
            aggData.nameLookup.addName(currClass.name);
        }
    });
    console.log(JSON.stringify(aggData.nameLookup));
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
var SplitNameNode = /** @class */ (function () {
    function SplitNameNode(key, value) {
        if (key === void 0) { key = ""; }
        if (value === void 0) { value = ""; }
        this.key = key;
        this.value = value;
        this.children = {};
    }
    SplitNameNode.prototype.addChild = function (child) {
        this.children[child.key] = child;
    };
    return SplitNameNode;
}());
var SplitNameMatcher = /** @class */ (function () {
    function SplitNameMatcher(root) {
        this.root = root;
        this.reset();
    }
    /* Returns all names that match when this word is added. */
    SplitNameMatcher.prototype.nextWord = function (word) {
        var result = [];
        this.matches.push(this.root);
        for (var i = this.matches.length - 1; i >= 0; i--) {
            var child = this.matches[i].children[word];
            if (child) {
                if (child.value) {
                    /* Using unshift to add the match to the array means that
                     * the longest matches will appear first in the array.
                     * User can then just use the first array element if only
                     * the longest match is needed.
                     */
                    result.unshift(child.value);
                    this.matches.splice(i, 1);
                }
                else {
                    this.matches[i] = child;
                }
            }
            else {
                this.matches.splice(i, 1);
            }
        }
        if (result = []) {
            return null;
        }
        else {
            return result;
        }
    };
    SplitNameMatcher.prototype.reset = function () {
        this.matches = [];
    };
    return SplitNameMatcher;
}());
var SplitNameLookup = /** @class */ (function () {
    function SplitNameLookup() {
        this.root = new SplitNameNode();
    }
    SplitNameLookup.prototype.addName = function (name) {
        var spacedName = name.replace(/([A-Z])/g, " $1");
        var segments = spacedName.trim().toLowerCase().split(" ");
        var currNode = this.root;
        segments.forEach(function (segment, index) {
            var value = "";
            if (index < (segments.length - 1)) {
                value = name;
            }
            var childNode = currNode.children[segment];
            if (!childNode) {
                childNode = new SplitNameNode(segment, value);
                currNode.addChild(childNode);
            }
            currNode = childNode;
        });
    };
    return SplitNameLookup;
}());
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
    var matcher = new SplitNameMatcher(aggData.nameLookup);
    for (var scanner = new WordScanner(text); !scanner.finished(); scanner.next()) {
        var word = scanner.current
            .replace(/'s$/, "")
            .replace(/^[;:,\."']+/g, "")
            .replace(/[;:,\."']+$/g, "");
        var link = resolveTypeLink(aggData, word);
        if (!link) {
            var match_1 = matcher.nextWord(word.toLowerCase());
            if (match_1) {
                link = resolveTypeLink(aggData, match_1[0]);
            }
        }
        if (link) {
            console.log("Found word link:" + link);
            var linkNode = unist.makeLink(unist.makeText(scanner.current), link);
            var prevText = text.substring(currTextStart, scanner.index);
            result.push(unist.makeText(prevText));
            result.push(linkNode);
            currTextStart = scanner.nextIndex;
            matcher.reset();
        }
    }
    var remainingText = text.substring(currTextStart, text.length);
    if (remainingText) {
        result.push(unist.makeText(remainingText));
    }
    return result;
}
function resolveTypeLink(aggData, text) {
    var possTypeName = cleanTypeName(text);
    var ref = aggData.projData.findReflectionByName(possTypeName);
    if (ref && isLinkable(ref.kind)) {
        var kebabName = ngHelpers.kebabifyClassName(possTypeName);
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
function cleanTypeName(text) {
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
