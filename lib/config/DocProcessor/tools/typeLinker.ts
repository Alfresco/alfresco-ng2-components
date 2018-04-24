import * as path from "path";
import * as fs from "fs";

import * as remark from "remark";
import * as stringify from "remark-stringify";
import * as frontMatter from "remark-frontmatter";

import {
    Application,
    ProjectReflection,
    Reflection,
    DeclarationReflection,
    SignatureReflection,
    ParameterReflection,
    ReflectionKind,
    TraverseProperty,
    Decorator
 } from "typedoc";
import { CommentTag } from "typedoc/dist/lib/models";

import * as unist from "../unistHelpers";
import * as ngHelpers from "../ngHelpers";


const includedNodeTypes = [
    "root", "paragraph", "inlineCode", "list", "listItem",
    "table", "tableRow", "tableCell", "emphasis", "strong",
    "link", "text"
];

const docFolder = path.resolve("..", "docs");
const adfLibNames = ["core", "content-services", "insights", "process-services"];


export function initPhase(aggData) {
    aggData.docFiles = {};
    aggData.nameLookup = new SplitNameLookup();

    adfLibNames.forEach(libName => {
        let libFolderPath = path.resolve(docFolder, libName);

        let files = fs.readdirSync(libFolderPath);

        files.forEach(file => {
            if (path.extname(file) === ".md") {
                let relPath = libFolderPath.substr(libFolderPath.indexOf("docs") + 5).replace(/\\/, "/") + "/" + file;
                let compName = path.basename(file, ".md");
                aggData.docFiles[compName] = relPath;
            }
        });
    });

    let classes = aggData.projData.getReflectionsByKind(ReflectionKind.Class);

    classes.forEach(currClass => {
        if (currClass.name.match(/(Component|Directive|Interface|Model|Pipe|Service|Widget)$/)) {
            aggData.nameLookup.addName(currClass.name);
        }
    });

    //console.log(JSON.stringify(aggData.nameLookup));
}

export function readPhase(tree, pathname, aggData) {}


export function aggPhase(aggData) {

}


export function updatePhase(tree, pathname, aggData) {
    traverseMDTree(tree);
    return true;


    function traverseMDTree(node) {
        if (!includedNodeTypes.includes(node.type)) {
            return;
        }
    
        if (node.type === "inlineCode") {
            let link = resolveTypeLink(aggData, node.value);

            if (link) {
                convertNodeToTypeLink(node, node.value, link);
            }
            
        } else if (node.type === "link") {
            if (node.children && (
                (node.children[0].type === "inlineCode") ||
                (node.children[0].type === "text")
            )) {
                let link = resolveTypeLink(aggData, node.children[0].value);

                if (link) {
                    convertNodeToTypeLink(node, node.children[0].value, link);
                }
            }
        } else if (node.type === "paragraph") {
            node.children.forEach((child, index) => {
                if (child.type === "text") {
                    let newNodes = handleLinksInBodyText(aggData, child.value);
                    node.children.splice(index, 1, ...newNodes);
                } else {
                    traverseMDTree(child);
                }
            });
        } else if (node.children) {
            node.children.forEach(child => {
                traverseMDTree(child);
            });
        }
    }
}


class SplitNameNode {
    children: {};

    constructor(public key: string = "", public value: string = "") {
        this.children = {};
    }

    addChild(child: SplitNameNode) {
        this.children[child.key] = child;
    }
}


class SplitNameMatchElement {
    constructor(public node: SplitNameNode, public textPos: number) {}
}


class SplitNameMatchResult {
    constructor(public value: string, public startPos: number) {}
}


class SplitNameMatcher {
    matches: SplitNameMatchElement[];

    constructor(public root: SplitNameNode) {
        this.reset();
    }

    /* Returns all names that match when this word is added. */
    nextWord(word: string, textPos: number): SplitNameMatchResult[] {
        let result = [];

        this.matches.push(new SplitNameMatchElement(this.root, textPos));

        for (let i = this.matches.length - 1; i >= 0; i--) {
            if (this.matches[i].node.children) {
                let child = this.matches[i].node.children[word];

                if (child) {
                    if (child.value) {
                        /* Using unshift to add the match to the array means that
                        * the longest matches will appear first in the array.
                        * User can then just use the first array element if only
                        * the longest match is needed.
                        */
                        result.unshift(new SplitNameMatchResult(child.value, this.matches[i].textPos));
                        this.matches.splice(i, 1);
                    } else {
                        this.matches[i] = new SplitNameMatchElement(child, this.matches[i].textPos);
                    }
                } else {
                    this.matches.splice(i, 1);
                }
            } else {
                this.matches.splice(i, 1);
            }
        }

        if (result === []) {
            return null;
        } else {
            return result;
        }
    }

    reset() {
        this.matches = [];
    }
}


class SplitNameLookup {
    root: SplitNameNode;

    constructor() {
        this.root = new SplitNameNode();
    }

    addName(name: string) {
        let spacedName = name.replace(/([A-Z])/g, " $1");
        let segments = spacedName.trim().toLowerCase().split(" ");

        let currNode = this.root;

        segments.forEach((segment, index) => {
            let value = "";

            if (index == (segments.length - 1)) {
                value = name;
            }

            let childNode = currNode.children[segment];

            if (!childNode) {
                childNode = new SplitNameNode(segment, value);
                currNode.addChild(childNode);
            }

            currNode = childNode;
        });
    }
}


class WordScanner {
    separators: string;
    index: number;
    nextSeparator: number;
    current: string;

    constructor(public text: string) {
        this.separators = " \n\r\t.;:";
        this.index = 0;
        this.nextSeparator = 0;
        this.next();
    }
    
    finished() {
        return this.index >= this.text.length;
    }

    next(): void {
        this.advanceIndex();
        this.advanceNextSeparator();
        this.current = this.text.substring(this.index, this.nextSeparator);
    }

    advanceNextSeparator() {
        for (let i = this.index; i < this.text.length; i++) {
            if (this.separators.indexOf(this.text[i]) !== -1) {
                this.nextSeparator = i;
                return;
            }
        }

        this.nextSeparator = this.text.length;
    }

    advanceIndex() {
        for (let i = this.nextSeparator; i < this.text.length; i++) {
            if (this.separators.indexOf(this.text[i]) === -1) {
                this.index = i;
                return;
            }
        }

        this.index = this.text.length;
    }
}


function handleLinksInBodyText(aggData, text: string): Node[] {
    let result = [];
    let currTextStart = 0;
    let matcher = new SplitNameMatcher(aggData.nameLookup.root);

    for (let scanner = new WordScanner(text); !scanner.finished(); scanner.next()) {
        let word = scanner.current
        .replace(/'s$/, "")
        .replace(/^[;:,\."']+/g, "")
        .replace(/[;:,\."']+$/g, "");

        let link = resolveTypeLink(aggData, word);
        let matchStart;

        if (!link) {
            let match = matcher.nextWord(word.toLowerCase(), scanner.index);

            if (match && match[0]) {
                link = resolveTypeLink(aggData, match[0].value);
                matchStart = match[0].startPos;
            }
        } else {
            matchStart = scanner.index
        }

        if (link) {
            let linkText = text.substring(matchStart, scanner.nextSeparator);
            let linkNode = unist.makeLink(unist.makeText(linkText), link);
            let prevText = text.substring(currTextStart, matchStart);
            result.push(unist.makeText(prevText));
            result.push(linkNode);
            currTextStart = scanner.nextSeparator;
            matcher.reset();
        }
    }
    
    let remainingText = text.substring(currTextStart, text.length);

    if (remainingText) {
        result.push(unist.makeText(remainingText));
    }

    return result;
}


function resolveTypeLink(aggData, text): string {
    let possTypeName = cleanTypeName(text);
    let ref: Reflection = aggData.projData.findReflectionByName(possTypeName);

    if (ref && isLinkable(ref.kind)) {
        let kebabName = ngHelpers.kebabifyClassName(possTypeName);
        let possDocFile = aggData.docFiles[kebabName];
        let url = "../../lib/" + ref.sources[0].fileName;
        
        if (possDocFile) {
            url = "../" + possDocFile;
        }

        return url;
    } else {
        return "";
    }
}


function cleanTypeName(text) {
    let matches = text.match(/[a-zA-Z0-9_]+<([a-zA-Z0-9_]+)>/);

    if (matches) {
        return matches[1];
    } else {
        return text;
    }
}


function isLinkable(kind: ReflectionKind) {
    return (kind === ReflectionKind.Class) ||
    (kind === ReflectionKind.Interface) ||
    (kind === ReflectionKind.Enum);
}

function convertNodeToTypeLink(node, text, url) {
    let linkDisplayText = unist.makeInlineCode(text);
    node.type = "link";
    node.url = url;
    node.children = [linkDisplayText];
}
