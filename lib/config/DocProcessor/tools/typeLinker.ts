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
import { ChildableComponent } from "typedoc/dist/lib/utils";
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from "constants";


const includedNodeTypes = [
    "root", "paragraph", "inlineCode", "list", "listItem",
    "table", "tableRow", "tableCell", "emphasis", "strong",
    "link", "text"
];

const docFolder = path.resolve("..", "docs");
const adfLibNames = ["core", "content-services", "insights", "process-services"];


export function initPhase(aggData) {
    aggData.docFiles = {};

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
                    node.children = [...node.children.slice(0, index), ...newNodes, ...node.children.slice(index + 1)];
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


class WordScanner {
    index: number;
    nextIndex: number;
    current: string;

    constructor(public text: string) {
        this.index = -1;
        this.nextIndex = 0;
        this.next();
    }
    
    finished() {
        return this.index >= this.text.length;
    }

    next(): void {
        this.index = this.nextIndex + 1;
        this.nextIndex = this.text.indexOf(" ", this.index);

        if (this.nextIndex === -1) {
            this.nextIndex = this.text.length;
        }

        this.current = this.text.substring(this.index, this.nextIndex);
    }
}


function handleLinksInBodyText(aggData, text: string): Node[] {
    let result = [];
    let currTextStart = 0;

    for (let scanner = new WordScanner(text); !scanner.finished(); scanner.next()) {
        let word = scanner.current
        .replace(/'s$/, "")
        .replace(/^[;:,\."']+/g, "")
        .replace(/[;:,\."']+$/g, "");

        let link = resolveTypeLink(aggData, word);

        if (link) {
            let linkNode = unist.makeLink(unist.makeText(scanner.current), link);
            let prevText = text.substring(currTextStart, scanner.index);
            result.push(unist.makeText(prevText));
            result.push(linkNode);
            currTextStart = scanner.nextIndex;
        }
    }
    
    let remainingText = text.substring(currTextStart, text.length);

    if (remainingText) {
        result.push(unist.makeText(remainingText));
    }

    return result;
}


function resolveTypeLink(aggData, text): string {
    let possClassName = cleanClassName(text);
    let ref: Reflection = aggData.projData.findReflectionByName(possClassName);

    if (ref && isLinkable(ref.kind)) {
        let kebabName = ngHelpers.kebabifyClassName(possClassName);
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


function cleanClassName(text) {
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
