import * as fs from "fs";
import * as path from "path";

import * as replaceSection from "mdast-util-heading-range";
import * as remark from "remark";
import * as frontMatter from "remark-frontmatter";

import * as combyne from "combyne";

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


let libFolders = ["core", "content-services", "process-services", "insights"];
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
    typeLink: string;
    defaultValue: string;
    docText: string;
    isInput: boolean;
    isOutput: boolean;
    isDeprecated: boolean;

    constructor(rawProp: DeclarationReflection) {
        this.name = rawProp.name;
        this.docText = rawProp.comment ? rawProp.comment.shortText : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
        this.defaultValue = rawProp.defaultValue || "";
        this.defaultValue = this.defaultValue.replace(/\|/, "\\|");
        this.type = rawProp.type ? rawProp.type.toString() : "";

        this.isDeprecated = rawProp.comment && rawProp.comment.hasTag("deprecated");

        if (this.isDeprecated) {
            this.docText = "**Deprecated:** " + rawProp.comment.getTag("deprecated").text.replace(/[\n\r]+/g, " ").trim();
        }

        if (rawProp.decorators) {
            rawProp.decorators.forEach(dec => {
                if (dec.name === "Input") {
                    this.isInput = true;

                    /*
                    if (dec.arguments) {
                        let bindingName = dec.arguments["bindingPropertyName"];
                        console.log(JSON.stringify(dec.arguments));
                        
                        if (bindingName && (bindingName !== ""))
                            this.name = bindingName;
                        
                    }
                    */
                   
                    if (!this.docText && !this.isDeprecated)
                        console.log(`Warning: Input "${rawProp.getFullName()}" has no doc text.`);
                }

                if (dec.name === "Output") {
                    this.isOutput = true;

                    if (!this.docText && !this.isDeprecated)
                        console.log(`Warning: Output "${rawProp.getFullName()}" has no doc text.`);
                }
            });
        }
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
        this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
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
    returnDocText: string;
    returnsSomething: boolean;
    signature: string;
    params: ParamInfo[];
    isDeprecated: boolean;

    constructor(rawSig: SignatureReflection) {
        this.name = rawSig.name;
        this.returnType = rawSig.type ? rawSig.type.toString() : "";
        this.returnsSomething = this.returnType != "void";

        if (rawSig.hasComment()) {
            this.docText = rawSig.comment.shortText + rawSig.comment.text;
            this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
            
            if (!this.docText)
                console.log(`Warning: method "${rawSig.name}" has no doc text.`);

            this.returnDocText = rawSig.comment.returns;
            this.returnDocText = this.returnDocText ? this.returnDocText.replace(/[\n\r]+/g, " ").trim() : "";
            
            if (this.returnDocText.toLowerCase() === "nothing")
                this.returnsSomething = false;

            if (this.returnsSomething && !this.returnDocText)
                console.log(`Warning: Return value of method "${rawSig.name}" has no doc text.`);
            
            this.isDeprecated = rawSig.comment.hasTag("deprecated");
        }

        this.params = [];
        let paramStrings = [];

        if (rawSig.parameters) {
            rawSig.parameters.forEach(rawParam => {
                if (!rawParam.comment || !rawParam.comment.text)
                console.log(`Warning: parameter "${rawParam.name}" of method "${rawSig.name}" has no doc text.`);
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
    /*
    aggData.liq = liquid({
        root: templateFolder
    });
    */
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
        let templateName = path.resolve(templateFolder, classType + ".combyne");
        let templateSource = fs.readFileSync(templateName, "utf8");
        let template = combyne(templateSource);

        let mdText = template.render(compData);
        let newSection = remark().parse(mdText.trim()).children;

        replaceSection(tree, "Class members", (before, section, after) => {
            newSection.unshift(before);
            newSection.push(after);
            return newSection;
        });
        /*
        let templateName = classType[0] + ".liquid";

        aggData.liq
        .renderFile(templateName, compData)
        .then(mdText => {
            let newSection = remark().parse(mdText).children;
            replaceSection(tree, "Class members", (before, section, after) => {
                newSection.unshift(before);
                newSection.push(after);
                return newSection;
            });

            fs.writeFileSync(pathname, remark().use(frontMatter, {type: 'yaml', fence: '---'}).data("settings", {paddedTable: false}).stringify(tree));
        
        });
        */
    }

    return true;
}


function renderInputs(comp: ComponentInfo): string {
    var result = "";

    comp.properties.forEach(prop => {
        result += `| ${prop.name} | \`${prop.type}\` | ${prop.defaultValue} | ${prop.docText} |\n`;
    });

    return result;
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
