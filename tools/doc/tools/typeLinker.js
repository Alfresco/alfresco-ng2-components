"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDocs = void 0;
var path = require("path");
var unist = require("../unistHelpers");
var ngHelpers = require("../ngHelpers");
var includedNodeTypes = [
    'root', 'paragraph', 'inlineCode', 'list', 'listItem',
    'table', 'tableRow', 'tableCell', 'emphasis', 'strong',
    'link', 'text'
];
var externalNameLinks;
var linkOverrides;
var ignoreLinkWords;
function processDocs(mdCache, aggData) {
    initPhase(aggData, mdCache);
    var pathnames = Object.keys(mdCache);
    pathnames.forEach(function (pathname) {
        updateFile(mdCache[pathname].mdOutTree, pathname, aggData);
    });
}
exports.processDocs = processDocs;
function initPhase(aggData, mdCache) {
    externalNameLinks = aggData.config.externalNameLinks;
    ignoreLinkWords = aggData.config.ignoreLinkWords;
    linkOverrides = {};
    aggData.config.linkOverrides.forEach(function (override) {
        linkOverrides[override.toLowerCase()] = 1;
    });
    aggData.docFiles = {};
    aggData.nameLookup = new SplitNameLookup();
    var docFilePaths = Object.keys(mdCache);
    docFilePaths.forEach(function (docFilePath) {
        var relPath = docFilePath.substring(docFilePath.indexOf('docs') + 5).replace(/\\/g, '/');
        var compName = path.basename(relPath, '.md');
        aggData.docFiles[compName] = relPath;
    });
    var classNames = Object.keys(aggData.classInfo);
    classNames.forEach(function (currClassName) {
        if (currClassName.match(/(Component|Directive|Interface|Model|Pipe|Service|Widget)$/)) {
            aggData.nameLookup.addName(currClassName);
        }
    });
}
function updateFile(tree, pathname, aggData) {
    traverseMDTree(tree);
    return true;
    function traverseMDTree(node) {
        if (!includedNodeTypes.includes(node.type)) {
            return;
        }
        if (node.type === 'link') {
            if (node.children[0] && ((node.children[0].type === 'inlineCode') ||
                (node.children[0].type === 'text'))) {
                if (!ignoreLinkWords.includes(node.children[0].value)) {
                    var link = resolveTypeLink(aggData, pathname, node.children[0].value);
                    if (link) {
                        convertNodeToTypeLink(node, node.children[0].value, link);
                    }
                }
            }
        }
        else if ((node.children) && (node.type !== 'heading')) {
            node.children.forEach(function (child, index) {
                var _a;
                if ((child.type === 'text') || (child.type === 'inlineCode')) {
                    var newNodes = handleLinksInBodyText(aggData, pathname, child.value, child.type === 'inlineCode');
                    (_a = node.children).splice.apply(_a, __spreadArray([index, 1], newNodes, false));
                }
                else {
                    traverseMDTree(child);
                }
            });
        }
    }
}
var SplitNameNode = /** @class */ (function () {
    function SplitNameNode(key, value) {
        if (key === void 0) { key = ''; }
        if (value === void 0) { value = ''; }
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
        var spacedName = name.replace(/([A-Z])/g, ' $1');
        var segments = spacedName.trim().toLowerCase().split(' ');
        var currNode = this.root;
        segments.forEach(function (segment, index) {
            var value = '';
            if (index === (segments.length - 1)) {
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
        this.separators = ' \n\r\t.;:<>[]&|';
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
function handleLinksInBodyText(aggData, docFilePath, text, wrapInlineCode) {
    if (wrapInlineCode === void 0) { wrapInlineCode = false; }
    var result = [];
    var currTextStart = 0;
    var matcher = new SplitNameMatcher(aggData.nameLookup.root);
    for (var scanner = new WordScanner(text); !scanner.finished(); scanner.next()) {
        var word = scanner.current
            .replace(/'s$/, '')
            .replace(/^[;:,\."']+/g, '')
            .replace(/[;:,\."']+$/g, '');
        if (!ignoreLinkWords.includes(word)) {
            var link = resolveTypeLink(aggData, docFilePath, word);
            var matchStart = void 0;
            if (!link) {
                var match = matcher.nextWord(word.toLowerCase(), scanner.index);
                if (match && match[0]) {
                    link = resolveTypeLink(aggData, docFilePath, match[0].value);
                    matchStart = match[0].startPos;
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
function resolveTypeLink(aggData, docFilePath, text) {
    var possTypeName = cleanTypeName(text);
    if (possTypeName === 'constructor') {
        return '';
    }
    var classInfo = aggData.classInfo[possTypeName];
    if (linkOverrides[possTypeName.toLowerCase()]) {
        return '';
    }
    else if (externalNameLinks[possTypeName]) {
        return externalNameLinks[possTypeName];
    }
    else if (classInfo) {
        var kebabName = ngHelpers.kebabifyClassName(possTypeName);
        var possDocFile = aggData.docFiles[kebabName];
        var url = fixRelSrcUrl(docFilePath, classInfo.sourcePath);
        if (possDocFile) {
            url = fixRelDocUrl(docFilePath, possDocFile);
        }
        return url;
    }
    else {
        return '';
    }
}
function fixRelSrcUrl(docPath, srcPath) {
    var relDocPath = docPath.substring(docPath.indexOf('docs'));
    var docPathSegments = relDocPath.split(/[\\\/]/);
    var dotPathPart = '';
    for (var i = 0; i < (docPathSegments.length - 1); i++) {
        dotPathPart += '../';
    }
    return dotPathPart + srcPath;
}
function fixRelDocUrl(docPathFrom, docPathTo) {
    var relDocPathFrom = docPathFrom.substring(docPathFrom.indexOf('docs'));
    var docPathSegments = relDocPathFrom.split(/[\\\/]/);
    var dotPathPart = '';
    for (var i = 0; i < (docPathSegments.length - 2); i++) {
        dotPathPart += '../';
    }
    return dotPathPart + docPathTo;
}
function cleanTypeName(text) {
    var matches = text.match(/[a-zA-Z0-9_]+<([a-zA-Z0-9_]+)(\[\])?>/);
    if (matches) {
        return matches[1];
    }
    else {
        return text.replace(/\[\]$/, '');
    }
}
function convertNodeToTypeLink(node, text, url, title) {
    if (title === void 0) { title = null; }
    var linkDisplayText = unist.makeInlineCode(text);
    node.type = 'link';
    node.title = title;
    node.url = url;
    node.children = [linkDisplayText];
}
