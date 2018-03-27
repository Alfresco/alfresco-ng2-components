import * as fs from "fs";
import * as path from "path";

import * as heading from "mdast-util-heading-range";
import * as remark from "remark";

import * as liquid from "liquidjs";

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
let templateFolder = path.resolve(".", "config", "DocProcessor", "templates");

let excludePatterns = [
    "**/*.spec.ts"
];

let propTemp = `{% for prop in properties %}
| {{prop.name}} | {{prop.type}} | {{prop.defaultValue}} | {{prop.docText}} |
{% endfor %}`;

let nameExceptions = {
    "datatable.component": "DataTableComponent",
    "tasklist.service": "TaskListService"
}


class PropInfo {
    name: string;
    type: string;
    defaultValue: string;
    docText: string;
    isInput: boolean;
    isOutput: boolean;
    isDeprecated: boolean;

    constructor(rawProp: DeclarationReflection) {
        this.name = rawProp.name;
        this.docText = rawProp.comment ? rawProp.comment.shortText : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ");
        this.defaultValue = rawProp.defaultValue;
        this.type = rawProp.type ? rawProp.type.toString() : "";

        if (rawProp.decorators) {
            rawProp.decorators.forEach(dec => {
                if (dec.name === "Input")
                    this.isInput = true;
                
                if (dec.name === "Output")
                    this.isOutput = true;
            });
        }

        if  (rawProp.comment && rawProp.comment.tags) {
            rawProp.comment.tags.forEach(tag => {
                if (tag.tagName === "deprecated")
                    this.isDeprecated = true;
            });
        }
    }
};

class MethodInfo {
    name: string;
    docText: string;
    returnType: string;
    signatures: string[];

    constructor(rawMeth: DeclarationReflection) {
        this.name = rawMeth.name;
        this.docText = rawMeth.hasComment() ? rawMeth.comment.shortText + rawMeth.comment.text : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ");
        this.returnType = rawMeth.type ? rawMeth.type.toString() : "";

        this.signatures = [];

        if (rawMeth.signatures){
            rawMeth.signatures.forEach(item => {
                let sigString = "(";

                if (item.parameters) {
                    let paramStrings = [];

                    item.parameters.forEach(param => {
                        paramStrings.push(`${param.name}: ${param.type.toString()}`);
                    });

                    sigString += paramStrings.join(", ");
                }

                sigString += ")";
                this.signatures.push(sigString);
            });
        }
            //sigs && sigs.length > 0 ? sigs[0].toString() : "";
    }
}


class ComponentInfo {
    properties: PropInfo[];
    methods: MethodInfo[];

    constructor(classRef: DeclarationReflection) {
        let props = classRef.getChildrenByKind(ReflectionKind.Property);
    
        this.properties = props.map(item => {
            return new PropInfo(item);
        });

        let methods = classRef.getChildrenByKind(ReflectionKind.Method);

        this.methods = methods.map(item => {
            return new MethodInfo(item);
        })
    }
}


export function initPhase(aggData) {
    let app = new Application({
        exclude: excludePatterns,
        ignoreCompilerErrors: true
    });

    let sources = app.expandInputFiles(libFolders);    
    aggData.projData = app.convert(sources);
    aggData.liq = liquid({
        root: templateFolder
    });
}


export function readPhase(tree, pathname, aggData) {
}


export function aggPhase(aggData) {
}


export function updatePhase(tree, pathname, aggData) {
    let compName = angNameToClassName(path.basename(pathname, ".md"));
    let classRef = aggData.projData.findReflectionByName(compName);
    let compData = new ComponentInfo(classRef);

    aggData.liq
    .renderFile("propTable.md", compData)
    .then(console.log);
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
