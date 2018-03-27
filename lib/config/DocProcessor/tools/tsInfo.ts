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
    SignatureReflection,
    ParameterReflection,
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

        this.isDeprecated = rawProp.comment && rawProp.comment.hasTag("deprecated");
    }
};


class ParamInfo {
    name: string;
    type: string;
    defaultValue: string;
    docText: string;
    combined: string;
    isOptional: boolean;

    constructor(rawParam: ParameterReflection) {
        this.name = rawParam.name;
        this.type = rawParam.type.toString();
        this.defaultValue = rawParam.defaultValue;
        this.docText = rawParam.comment ? rawParam.comment.text : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ");
        this.isOptional = rawParam.flags.isOptional;

        this.combined = this.name;

        if (this.isOptional)
            this.combined += "?";

        this.combined += `: ${this.type}`;
        
        if (this.defaultValue !== "")
            this.combined += ` = ${this.defaultValue}`;
    }
}


class MethodSigInfo {
    name: string;
    docText: string;
    returnType: string;
    signature: string;
    params: ParamInfo[];
    isDeprecated: boolean;

    constructor(rawSig: SignatureReflection) {
        this.name = rawSig.name;
        this.docText = rawSig.hasComment() ? rawSig.comment.shortText + rawSig.comment.text : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ");
        this.returnType = rawSig.type ? rawSig.type.toString() : "";
        this.isDeprecated = rawSig.comment && rawSig.comment.hasTag("deprecated");

        this.params = [];
        let paramStrings = [];

        if (rawSig.parameters) {
            rawSig.parameters.forEach(rawParam => {
                let param = new ParamInfo(rawParam);
                this.params.push(param);
                paramStrings.push(param.combined);
            });
        }

        this.signature = "(" + paramStrings.join(", ") + ")";
    }
}


class ComponentInfo {
    properties: PropInfo[];
    methods: MethodSigInfo[];
    hasInputs: boolean;
    hasOutputs: boolean;
    hasMethods: boolean;

    constructor(classRef: DeclarationReflection) {
        let props = classRef.getChildrenByKind(ReflectionKind.Property);
    
        this.properties = props.map(item => {
            return new PropInfo(item);
        });

        let methods = classRef.getChildrenByKind(ReflectionKind.Method);

        this.methods = [];

        methods.forEach(method =>{
            if (!(method.flags.isPrivate || method.flags.isProtected)) {
                method.signatures.forEach(sig => {
                    this.methods.push(new MethodSigInfo(sig));
                });
            }
        });
        
        this.properties.forEach(prop => {
            if (prop.isInput)
                this.hasInputs = true;
            
            if (prop.isOutput)
                this.hasOutputs = true;
        });

        this.hasMethods = methods.length > 0;
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
    let classType = compName.match(/component|directive|service/i);

    if (classType) {
        let templateName = classType[0] + ".liquid";

        aggData.liq
        .renderFile(templateName, compData)
        .then(console.log);
    }
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
