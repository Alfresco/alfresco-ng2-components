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
            let possClassName = cleanClassName(node.value);
            let ref: DeclarationReflection = aggData.projData.findReflectionByName(possClassName);

            if (ref && isLinkable(ref.kind)) {
                let kebabName = ngHelpers.kebabifyClassName(possClassName);
                console.log(kebabName);
                let possDocFile = aggData.docFiles[kebabName];
                let url = "../../lib/" + ref.sources[0].fileName;
                
                if (possDocFile) {
                    url = "../" + possDocFile;
                }

                convertNodeToTypeLink(node, node.value, url);
            }
            
        } else if (node.type === "link") {
            if (node.children && (
                (node.children[0].type === "inlineCode") ||
                (node.children[0].type === "text")
            )) {
                let possClassName = cleanClassName(node.children[0].value);
                let ref: DeclarationReflection = aggData.projData.findReflectionByName(possClassName);

                if (ref && isLinkable(ref.kind)) {
                    let kebabName = ngHelpers.kebabifyClassName(possClassName);
                    console.log(kebabName);
                    let possDocFile = aggData.docFiles[kebabName];
                    let url = "../../lib/" + ref.sources[0].fileName;
                    
                    if (possDocFile) {
                        url = "../" + possDocFile;
                    }

                    convertNodeToTypeLink(node, node.children[0].value, url);
                }
            }
        } else if (node.children) {
            node.children.forEach(element => {
                traverseMDTree(element);
            });
        }
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
