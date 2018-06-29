import * as fs from "fs";
import * as path from "path";

import * as replaceSection from "mdast-util-heading-range";
import * as remark from "remark";
// import * as stringify from "remark-stringify";
// import * as frontMatter from "remark-frontmatter";

import * as ejs from "ejs";

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

import { MDNav } from "../mdNav";
import * as unist from "../unistHelpers";


let libFolders = ["core", "content-services", "process-services", "insights"];
let templateFolder = path.resolve("tools", "doc", "templates");

let excludePatterns = [
    "**/*.spec.ts"
];


let nameExceptions;

let undocMethodNames = {
    "ngOnChanges": 1
};


export function processDocs(mdCache, aggData, _errorMessages) {
    initPhase(aggData);
    
    let pathnames = Object.keys(mdCache);
    let internalErrors;

    pathnames.forEach(pathname => {
        internalErrors = [];
        updateFile(mdCache[pathname].mdOutTree, pathname, aggData, internalErrors);

        if (internalErrors.length > 0) {
            showErrors(pathname, internalErrors);
        }
    });
}


function showErrors(filename, errorMessages) {
    console.log(filename);

    errorMessages.forEach(message => {
        console.log("    " + message);
    });

    console.log("");
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

    errorMessages: string[];

    constructor(rawProp: DeclarationReflection) {
        this.errorMessages = [];
        this.name = rawProp.name;
        this.docText = rawProp.comment ? rawProp.comment.shortText : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
        this.defaultValue = rawProp.defaultValue || "";
        this.defaultValue = this.defaultValue.replace(/\|/, "\\|");
        this.type = rawProp.type ? rawProp.type.toString().replace(/\s/g, "") : "";
        this.type = this.type.replace(/\|/, "\\|");

        this.isDeprecated = rawProp.comment && rawProp.comment.hasTag("deprecated");

        if (this.isDeprecated) {
            this.docText = "(**Deprecated:** " + rawProp.comment.getTag("deprecated").text.replace(/[\n\r]+/g, " ").trim() + ") " + this.docText;
        }

        if (rawProp.decorators) {
            rawProp.decorators.forEach(dec => {
                //console.log(dec);
                if (dec.name === "Input") {
                    this.isInput = true;
                    
                    if (dec.arguments) {
                        let bindingName = dec.arguments["bindingPropertyName"];
                        
                        if (bindingName && (bindingName !== ""))
                            this.name = bindingName.replace(/['"]/g, "");
                    }
                    
                    if (!this.docText && !this.isDeprecated) {
                        this.errorMessages.push(`Warning: Input "${rawProp.name}" has no doc text.`);
                    }
                }

                if (dec.name === "Output") {
                    this.isOutput = true;

                    if (!this.docText && !this.isDeprecated) {
                        this.errorMessages.push(`Warning: Output "${rawProp.name}" has no doc text.`);
                    }
                }
            });
        }
    }

    get errors() {
        return this.errorMessages;
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
        this.type = rawParam.type.toString().replace(/\s/g, "");
        this.defaultValue = rawParam.defaultValue;
        this.docText = rawParam.comment ? rawParam.comment.text : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
        this.isOptional = rawParam.flags.isOptional;

        this.combined = this.name;

        if (this.isOptional)
            this.combined += "?";

        this.combined += `: \`${this.type}\``;
        
        if (this.defaultValue !== "")
            this.combined += ` = \`${this.defaultValue}\``;
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

    errorMessages: string[];


    constructor(rawSig: SignatureReflection) {
        this.errorMessages = [];
        this.name = rawSig.name;
        this.returnType = rawSig.type ? rawSig.type.toString().replace(/\s/g, "") : "";
        this.returnsSomething = this.returnType != "void";

        if (rawSig.hasComment()) {
            this.docText = rawSig.comment.shortText + rawSig.comment.text;
            this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
            
            if (!this.docText) {
                this.errorMessages.push(`Warning: method "${rawSig.name}" has no doc text.`);
            }

            this.returnDocText = rawSig.comment.returns;
            this.returnDocText = this.returnDocText ? this.returnDocText.replace(/[\n\r]+/g, " ").trim() : "";
            
            if (this.returnDocText.toLowerCase() === "nothing") {
                this.returnsSomething = false;
            }

            if (this.returnsSomething && !this.returnDocText) {
                this.errorMessages.push(`Warning: Return value of method "${rawSig.name}" has no doc text.`);
            }

            this.isDeprecated = rawSig.comment.hasTag("deprecated");
        }

        this.params = [];
        let paramStrings = [];

        if (rawSig.parameters) {
            rawSig.parameters.forEach(rawParam => {
                if (!rawParam.comment || !rawParam.comment.text) {
                    this.errorMessages.push(`Warning: parameter "${rawParam.name}" of method "${rawSig.name}" has no doc text.`);
                }

                let param = new ParamInfo(rawParam);
                this.params.push(param);
                paramStrings.push(param.combined);
            });
        }

        this.signature = "(" + paramStrings.join(", ") + ")";
    }

    get errors() {
        return this.errorMessages;
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
        let accessors = classRef.getChildrenByKind(ReflectionKind.Accessor);
        
        this.properties = [...props, ...accessors].map(item => {
            return new PropInfo(item);
        });

        let methods = classRef.getChildrenByKind(ReflectionKind.Method);

        this.methods = [];

        methods.forEach(method =>{
            if (!(method.flags.isPrivate || method.flags.isProtected || undocMethodNames[method.name])) {
                method.signatures.forEach(sig => {
                    this.methods.push(new MethodSigInfo(sig));
                });
            }
        });
        
        this.hasInputs = false;
        this.hasOutputs = false;
        
        this.properties.forEach(prop => {
            if (prop.isInput)
                this.hasInputs = true;
            
            if (prop.isOutput)
                this.hasOutputs = true;
        });

        this.hasMethods = methods.length > 0;
    }

    get errors() {
        let combinedErrors = [];

        this.methods.forEach(method => {
            method.errors.forEach(err => {
                combinedErrors.push(err);
            })
        });

        this.properties.forEach(prop => {
            prop.errors.forEach(err => {
                combinedErrors.push(err);
            });
        });

        return combinedErrors;
    }
}


function initPhase(aggData) {
    nameExceptions = aggData.config.typeNameExceptions;

    let app = new Application({
        exclude: excludePatterns,
        ignoreCompilerErrors: true,
        experimentalDecorators: true,
        tsconfig: "tsconfig.json"
    });

    let sources = app.expandInputFiles(libFolders.map(folder => {
        return path.resolve("lib", folder);
    }));    
    
    aggData.projData = app.convert(sources);
}




function updateFile(tree, pathname, aggData, errorMessages) {
    let compName = angNameToClassName(path.basename(pathname, ".md"));
    let classRef = aggData.projData.findReflectionByName(compName);

    if (!classRef) {
        // A doc file with no corresponding class (eg, Document Library Model).
        return false;
    }

    let compData = new ComponentInfo(classRef);
    let classTypeMatch = compName.match(/component|directive|service/i);

    if (classTypeMatch) {
        let classType = classTypeMatch[0].toLowerCase();

        // Copy docs back from the .md file when the JSDocs are empty.
        let inputMD = getPropDocsFromMD(tree, "Properties", 3);
        let outputMD = getPropDocsFromMD(tree, "Events", 2);
        updatePropDocsFromMD(compData, inputMD, outputMD, errorMessages);
       
        if (classType === "service") {
            let methodMD = getMethodDocsFromMD(tree);
            updateMethodDocsFromMD(compData, methodMD, errorMessages);
        }

        let templateName = path.resolve(templateFolder, classType + ".ejs");
        let templateSource = fs.readFileSync(templateName, "utf8");
        let template = ejs.compile(templateSource);

        let mdText = template(compData);
        mdText = mdText.replace(/^ +\|/mg, "|");

        let newSection = remark().parse(mdText.trim()).children;

        replaceSection(tree, "Class members", (before, section, after) => {
            newSection.unshift(before);
            newSection.push(after);
            return newSection;
        });

        compData.errors.forEach(err => {
            errorMessages.push(err);
        })
    }

    return true;
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


function getPropDocsFromMD(tree, sectionHeading, docsColumn) {
    let result = {}

    let nav = new MDNav(tree);

    let classMemHeading = nav
    .heading(h => {
        return (h.children[0].type === "text") && (h.children[0].value === "Class members");
    });

    let propsTable = classMemHeading
    .heading(h => {
        return (h.children[0].type === "text") && (h.children[0].value === sectionHeading);
    }).table();

    let propTableRow = propsTable.childNav
    .tableRow(()=>true, 1).childNav;

    let i = 1;

    while (!propTableRow.empty) {
        let propName = propTableRow
        .tableCell().childNav
        .text().item.value;

        let propDocText = propTableRow
        .tableCell(()=>true, docsColumn).childNav
        .text().item;

        if (propDocText) {
            result[propName] = propDocText.value;
        }

        i++;
        propTableRow = propsTable.childNav
        .tableRow(()=>true, i).childNav;
    }
    
    return result;
}


function getMethodDocsFromMD(tree) {
    let result = {}

    let nav = new MDNav(tree);

    let classMemHeading = nav
    .heading(h => {
        return (h.children[0].type === "text") && (h.children[0].value === "Class members");
    });

    let methListItems = classMemHeading
    .heading(h => {
        return (h.children[0].type === "text") && (h.children[0].value === "Methods");
    }).list().childNav;

    let methItem = methListItems
    .listItem();

    let i = 0;

    while (!methItem.empty) {
        let methNameSection = methItem.childNav
        .paragraph().childNav
        .strong().childNav;

        let methName = '';

        // Method docs must be in "new" format with names and types styled separately.
        if (!methNameSection.empty) {
            methName = methNameSection.text().item.value;

            let methDoc = methItem.childNav
            .paragraph().childNav
            .html()
            .text().value;

            let params = getMDMethodParams(methItem);

            result[methName] = {
                "docText": methDoc.replace(/^\n/, ""),
                "params": params
            };
        }

        i++;

        methItem = methListItems
        .listItem(l=>true, i);
    }
    /*
    let newRoot = unist.makeRoot([methList.item]);
    console.log(remark().use(frontMatter, {type: 'yaml', fence: '---'}).data("settings", {paddedTable: false, gfm: false}).stringify(tree));
    */

    return result;
}


function getMDMethodParams(methItem: MDNav) {
    let result = {};

    let paramList = methItem.childNav.list().childNav;

    let paramListItems = paramList
    .listItems();

    paramListItems.forEach(paramListItem => {
        let paramNameNode = paramListItem.childNav
        .paragraph().childNav
        .emph().childNav;

        let paramName;

        if (!paramNameNode.empty) {
            paramName = paramNameNode.text().item.value.replace(/:/, "");
        } else {
            paramName = paramListItem.childNav
            .paragraph().childNav
            .strong().childNav
            .text().item.value;
        }

        let paramDoc = paramListItem.childNav
        .paragraph().childNav
        .text(t=>true, 1).item.value;

        result[paramName] = paramDoc.replace(/^[ -]+/, "");
    });

    return result;
}


function updatePropDocsFromMD(comp: ComponentInfo, inputDocs, outputDocs, errorMessages) {
    comp.properties.forEach(prop => {
        let propMDDoc: string;

        if (prop.isInput) {
            propMDDoc = inputDocs[prop.name];
        } else if (prop.isOutput) {
            propMDDoc = outputDocs[prop.name];
        }

        // If JSDocs are empty but MD docs aren't then the Markdown is presumably more up-to-date.
        if (!prop.docText && propMDDoc) {
            prop.docText = propMDDoc;
            errorMessages.push(`Warning: empty JSDocs for property "${prop.name}" may need sync with the .md file.`);
        }
    });
}


function updateMethodDocsFromMD(comp: ComponentInfo, methodDocs, errorMessages) {
    comp.methods.forEach(meth => {
        let currMethMD = methodDocs[meth.name]

        // If JSDocs are empty but MD docs aren't then the Markdown is presumably more up-to-date.
        if (!meth.docText && currMethMD && currMethMD.docText) {
            meth.docText = currMethMD.docText;
            errorMessages.push(`Warning: empty JSDocs for method sig "${meth.name}" may need sync with the .md file.`);
        }
        
        meth.params.forEach(param => {
            if (!param.docText && currMethMD && currMethMD.params[param.name])
            {
                param.docText = currMethMD.params[param.name];
                errorMessages.push(`Warning: empty JSDocs for parameter "${param.name} (${meth.name})" may need sync with the .md file.`);
            }
        });
    });
}