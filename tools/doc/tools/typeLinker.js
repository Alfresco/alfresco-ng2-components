"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var docFolder = path.resolve("docs");
var adfLibNames = ["core", "content-services", "insights", "process-services"];
var externalTypes = {
    'Blob': 'https://developer.mozilla.org/en-US/docs/Web/API/Blob',
    'EventEmitter': 'https://angular.io/api/core/EventEmitter',
    'MatSnackBarRef': 'https://material.angular.io/components/snack-bar/overview',
    'TemplateRef': 'https://angular.io/api/core/TemplateRef',
    'Observable': 'http://reactivex.io/documentation/observable.html',
    'Subject': 'http://reactivex.io/documentation/subject.html',
    'AppDefinitionRepresentation': 'https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/AppDefinitionRepresentation.md',
    'DeletedNodesPaging': 'https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/DeletedNodesPaging.md',
    'MinimalNodeEntity': '../content-services/document-library.model.md',
    'MinimalNodeEntryEntity': '../content-services/document-library.model.md',
    'NodeEntry': 'https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodeEntry.md',
    'ProcessInstanceFilterRepresentation': 'https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/ProcessInstanceFilterRepresentation.md',
    'RelatedContentRepresentation': 'https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/RelatedContentRepresentation.md',
    'SiteEntry': 'https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SiteEntry.md',
    'SitePaging': 'https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitePaging.md'
};
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
    //console.log(JSON.stringify(aggData.nameLookup));
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
        else if ((node.type === "paragraph")) {
            node.children.forEach(function (child, index) {
                if ((child.type === "text") || (child.type === "inlineCode")) {
                    var newNodes = handleLinksInBodyText(aggData, child.value, child.type === 'inlineCode');
                    (_a = node.children).splice.apply(_a, [index, 1].concat(newNodes));
                }
                else {
                    traverseMDTree(child);
                }
                var _a;
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
var SplitNameMatchElement = /** @class */ (function () {
    function SplitNameMatchElement(node, textPos) {
        this.node = node;
        this.textPos = textPos;
    }
    return SplitNameMatchElement;
}());
var SplitNameMatchResult = /** @class */ (function () {
    function SplitNameMatchResult(value, startPos) {
        this.value = value;
        this.startPos = startPos;
    }
    return SplitNameMatchResult;
}());
var SplitNameMatcher = /** @class */ (function () {
    function SplitNameMatcher(root) {
        this.root = root;
        this.reset();
    }
    /* Returns all names that match when this word is added. */
    SplitNameMatcher.prototype.nextWord = function (word, textPos) {
        var result = [];
        this.matches.push(new SplitNameMatchElement(this.root, textPos));
        for (var i = this.matches.length - 1; i >= 0; i--) {
            if (this.matches[i].node.children) {
                var child = this.matches[i].node.children[word];
                if (child) {
                    if (child.value) {
                        /* Using unshift to add the match to the array means that
                        * the longest matches will appear first in the array.
                        * User can then just use the first array element if only
                        * the longest match is needed.
                        */
                        result.unshift(new SplitNameMatchResult(child.value, this.matches[i].textPos));
                        this.matches.splice(i, 1);
                    }
                    else {
                        this.matches[i] = new SplitNameMatchElement(child, this.matches[i].textPos);
                    }
                }
                else {
                    this.matches.splice(i, 1);
                }
            }
            else {
                this.matches.splice(i, 1);
            }
        }
        if (result === []) {
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
            if (index == (segments.length - 1)) {
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
        this.separators = " \n\r\t.;:<>[]&|";
        this.index = 0;
        this.nextSeparator = 0;
        this.next();
    }
    WordScanner.prototype.finished = function () {
        return this.index >= this.text.length;
    };
    WordScanner.prototype.next = function () {
        this.advanceIndex();
        this.advanceNextSeparator();
        this.current = this.text.substring(this.index, this.nextSeparator);
    };
    WordScanner.prototype.advanceNextSeparator = function () {
        for (var i = this.index; i < this.text.length; i++) {
            if (this.separators.indexOf(this.text[i]) !== -1) {
                this.nextSeparator = i;
                return;
            }
        }
        this.nextSeparator = this.text.length;
    };
    WordScanner.prototype.advanceIndex = function () {
        for (var i = this.nextSeparator; i < this.text.length; i++) {
            if (this.separators.indexOf(this.text[i]) === -1) {
                this.index = i;
                return;
            }
        }
        this.index = this.text.length;
    };
    return WordScanner;
}());
function handleLinksInBodyText(aggData, text, wrapInlineCode) {
    if (wrapInlineCode === void 0) { wrapInlineCode = false; }
    var result = [];
    var currTextStart = 0;
    var matcher = new SplitNameMatcher(aggData.nameLookup.root);
    for (var scanner = new WordScanner(text); !scanner.finished(); scanner.next()) {
        var word = scanner.current
            .replace(/'s$/, "")
            .replace(/^[;:,\."']+/g, "")
            .replace(/[;:,\."']+$/g, "");
        var link = resolveTypeLink(aggData, word);
        var matchStart = void 0;
        if (!link) {
            var match_1 = matcher.nextWord(word.toLowerCase(), scanner.index);
            if (match_1 && match_1[0]) {
                link = resolveTypeLink(aggData, match_1[0].value);
                matchStart = match_1[0].startPos;
            }
        }
        else {
            matchStart = scanner.index;
        }
        if (link) {
            var linkText = text.substring(matchStart, scanner.nextSeparator);
            var linkTitle = void 0;
            if (wrapInlineCode) {
                linkTitle = unist.makeInlineCode(linkText);
            }
            else {
                linkTitle = unist.makeText(linkText);
            }
            var linkNode = unist.makeLink(linkTitle, link);
            var prevText = text.substring(currTextStart, matchStart);
            if (prevText) {
                if (wrapInlineCode) {
                    result.push(unist.makeInlineCode(prevText));
                }
                else {
                    result.push(unist.makeText(prevText));
                }
            }
            result.push(linkNode);
            currTextStart = scanner.nextSeparator;
            matcher.reset();
        }
    }
    var remainingText = text.substring(currTextStart, text.length);
    if (remainingText) {
        if (wrapInlineCode) {
            result.push(unist.makeInlineCode(remainingText));
        }
        else {
            result.push(unist.makeText(remainingText));
        }
    }
    return result;
}
function resolveTypeLink(aggData, text) {
    var possTypeName = cleanTypeName(text);
    if (possTypeName === 'constructor') {
        return "";
    }
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
    else if (externalTypes[possTypeName]) {
        return externalTypes[possTypeName];
    }
    else {
        return "";
    }
}
function cleanTypeName(text) {
    var matches = text.match(/[a-zA-Z0-9_]+<([a-zA-Z0-9_]+)(\[\])?>/);
    if (matches) {
        return matches[1];
    }
    else {
        return text.replace(/\[\]$/, "");
    }
}
function isLinkable(kind) {
    return (kind === typedoc_1.ReflectionKind.Class) ||
        (kind === typedoc_1.ReflectionKind.Interface) ||
        (kind === typedoc_1.ReflectionKind.Enum) ||
        (kind === typedoc_1.ReflectionKind.TypeAlias);
}
function convertNodeToTypeLink(node, text, url) {
    var linkDisplayText = unist.makeInlineCode(text);
    node.type = "link";
    node.url = url;
    node.children = [linkDisplayText];
}
