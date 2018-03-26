import * as fs from "fs";
import * as path from "path";

import * as heading from "mdast-util-heading-range";
import * as remark from "remark";

import {
    Application,
    ProjectReflection,
    Reflection,
    DeclarationReflection,
    ReflectionKind,
    TraverseProperty,
    Decorator
 } from "typedoc";
import { CommentTag } from "typedoc/dist/lib/models";


let libFolders = ["content-services"];//["core", "content-services", "process-services", "insights"];

let excludePatterns = [
    "**/*.spec.ts"
];

let nameExceptions = {
    "datatable.component": "DataTableComponent",
    "tasklist.service": "TaskListService"
}


class PropInfo {
    name: string;
    type: string;
    initializer: string;
    docText: string;
};


export function initPhase(aggData) {
    let app = new Application({
        exclude: excludePatterns,
        ignoreCompilerErrors: true
    });

    let sources = app.expandInputFiles(libFolders);    
    aggData.projData = app.convert(sources);
}


export function readPhase(tree, pathname, aggData) {
}


export function aggPhase(aggData) {
}


export function updatePhase(tree, pathname, aggData) {
    let compName = angNameToClassName(path.basename(pathname, ".md"));
    let ref = aggData.projData.findReflectionByName(compName);
    
    ref.traverse(traverse);

    function traverse(childRef: DeclarationReflection, travProp: TraverseProperty) {
        if (childRef.kind === ReflectionKind.Property) {
            
            if (childRef.decorators && hasInputDecorator(childRef.decorators)) {
                let propName = childRef.name;
                
                let docText = childRef.comment ? childRef.comment.shortText : "";

                if (childRef.comment && childRef.comment.tags) {
                    let depValue = hasDeprecatedTag(childRef.comment.tags);
                    if (depValue != "")
                        docText = "(Deprecated " + depValue + ") " + docText;
                }

                let defaultValue = childRef.defaultValue;
                let type = childRef.type.toString();

                console.log(`| ${propName} | ${type} | ${defaultValue} | ${docText} |`);
            }
        }
    }
}

function hasDeprecatedTag(tags: CommentTag[]): string {
    for (let i = 0; i < tags.length; i++) {
        if (tags[i].tagName === "deprecated")
            return tags[i].text.trim();
    }

    return "";
}

function hasInputDecorator(decs: Decorator[]) {
    for (let i = 0; i < decs.length; i++) {
        if (decs[i].name === "Input")
            return true;
    }

    return false;
}


function initialCap(str: string) {
    return str[0].toUpperCase() + str.substr(1);
}


function angNameToClassName(rawName: string) {
    if (nameExceptions[rawName])
        return nameExceptions[rawName];

	var name = rawName.replace(/\]|\(|\)/g, '');
	
    var fileNameSections = name.split('.');
    var compNameSections = fileNameSections[0].split('-');
    
    var outCompName = '';
    
    for (var i = 0; i < compNameSections.length; i++) {
        outCompName = outCompName + initialCap(compNameSections[i]);
    }
    
    var itemTypeIndicator = '';
    
    if (fileNameSections.length > 1) {
        itemTypeIndicator = initialCap(fileNameSections[1]);
    }
	
    var finalName = outCompName + itemTypeIndicator;
	
    return finalName;
}
