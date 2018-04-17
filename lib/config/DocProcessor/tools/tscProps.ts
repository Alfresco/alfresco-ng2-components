import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

import * as heading from "mdast-util-heading-range";
import * as remark from "remark";

import * as unist from "../unistHelpers";
import { JsxEmit, isClassDeclaration, PropertyDeclaration } from "typescript";


// Max number of characters in the text for the default value column.
const maxDefaultTextLength = 20;

let nameExceptions = {
    "datatable.component": "DataTableComponent",
    "tasklist.service": "TaskListService"
}


export function initPhase(aggData) {
}

export function readPhase(tree, pathname, aggData) {
}

export function aggPhase(aggData) {
}


interface NgDocAutoContent {
    extractClassInfoFromSource(checker: ts.TypeChecker, classDec: ts.ClassDeclaration);
    addContentToDoc(tree);
}

class PropData {
    name: string;
    type: string;
    initializer: string;
    docText: string;
}

class ParamData {
    name: string;
    type: string;
    docText: string;
    initializer: string;
    optional: boolean;

    getSignature() {
        let sig = this.name;

        if (this.optional)
            sig += "?";

        if (this.type)
            sig += ": " + this.type;

        if (this.initializer)
            sig += " = " + this.initializer;
        
        return sig;
    }
}

class MethodData {
    name: string;
    docText: string;
    params: ParamData[];
    returnType: string;

    constructor() {
        this.params = [];
    }

    getSignature() {
        let sig = this.name + "(";

        if (this.params.length > 0) {
            sig += this.params[0].getSignature();
        }

        for (let i = 1; i < this.params.length; i++) {
            sig += ", " + this.params[i].getSignature();
        }

        sig += ")";

        if (this.returnType !== "void") {
            sig += ": " + this.returnType;
        }

        return sig;
    }
}

class ComponentDocAutoContent implements NgDocAutoContent {
    inputs: PropData[];
    outputs: PropData[];

    constructor() {
        this.inputs = [];
        this.outputs = [];
    }


    extractClassInfoFromSource(checker: ts.TypeChecker, classDec: ts.ClassDeclaration) {
        let sourceFile = classDec.getSourceFile();

        for (var i = 0; i < classDec.members.length; i++) {
            let member = classDec.members[i];

            if (ts.isPropertyDeclaration(member) ||
                ts.isGetAccessorDeclaration(member) ||
                ts.isSetAccessorDeclaration(member)) {
                let prop: ts.PropertyDeclaration = member;

                let mods = ts.getCombinedModifierFlags(prop);
                let nonPrivate = (mods & ts.ModifierFlags.Private) === 0;
                let memSymbol = checker.getSymbolAtLocation(prop.name);
                
                if (nonPrivate && memSymbol && prop.decorators) {
                    let name = memSymbol.getName();
                    let initializer = "";
                    
                    if (prop.initializer) {
                        initializer = prop.initializer.getText(sourceFile);
                    }
                    
                    let doc = ts.displayPartsToString(memSymbol.getDocumentationComment(checker));
                    doc = doc.replace(/\r\n/g, " ");
                    
                    let propType = checker.typeToString(checker.getTypeOfSymbolAtLocation(memSymbol, memSymbol.valueDeclaration!));
                    
                    let dec = prop.decorators[0].getText(sourceFile);
                
                    if (dec.match(/@Input/)) {
                        this.inputs.push({
                            "name": name,
                            "type": propType,
                            "initializer": initializer,
                            "docText": doc
                        });
                    } else if (dec.match(/@Output/)) {
                        this.outputs.push({
                            "name": name,
                            "type": propType,
                            "initializer": "",
                            "docText": doc
                        });
                    }
                }
            }
        }
    }


    addContentToDoc(tree) {
        let inTable = buildPropsTable(this.inputs);
        let outTable = buildPropsTable(this.outputs, false);

        if (inTable) {
            heading(tree, "Properties", (before, section, after) => {
                return [before, inTable, after];
            });
        }

        if (outTable) {
            heading(tree, "Events", (before, section, after) => {
                return [before, outTable, after];
            });
        }
    }
}


class ServiceDocAutoContent implements NgDocAutoContent {
    props: PropData[];
    methods: MethodData[];

    constructor() {
        this.props = [];
        this.methods = [];
    }


    extractClassInfoFromSource(checker: ts.TypeChecker, classDec: ts.ClassDeclaration) {
        let sourceFile = classDec.getSourceFile();

        for (var i = 0; i < classDec.members.length; i++) {
            let member = classDec.members[i];

            if (ts.isMethodDeclaration(member)) {
                let method: ts.MethodDeclaration = member;

                let mods = ts.getCombinedModifierFlags(method);
                let nonPrivate = (mods & ts.ModifierFlags.Private) === 0;
                let memSymbol = checker.getSymbolAtLocation(method.name);
                
                if (nonPrivate && memSymbol) {
                    let methData = new MethodData();

                    methData.name = memSymbol.getName();
                    let doc = ts.displayPartsToString(memSymbol.getDocumentationComment());

                    if (!doc)
                        console.log(`Warning: Method ${classDec.name.escapedText}.${methData.name} is not documented`);

                    methData.docText = doc.replace(/\r\n/g, " ");
                    let sig = checker.getSignatureFromDeclaration(method);
                    let returnType = sig.getReturnType();
                    methData.returnType = checker.typeToString(returnType);
                    let returnSymbol = returnType.getSymbol();

                    let params = method.parameters;

                    for (let p = 0; p < params.length; p++){
                        let pData = new ParamData();
                        pData.name = params[p].name.getText();

                        if (params[p].type)
                            pData.type = params[p].type.getText();
                        else
                            pData.type = "";

                        let paramSymbol = checker.getSymbolAtLocation(params[p].name);
                        pData.docText = ts.displayPartsToString(paramSymbol.getDocumentationComment());
                        
                        if (!pData.docText)
                            console.log(`Warning: Parameter "${pData.name}" of ${classDec.name.escapedText}.${methData.name} is not documented`);

                        pData.optional = params[p].questionToken ? true : false;

                        if (params[p].initializer) {
                            let initText = params[p].initializer.getText();

                            if (initText !== "undefined")
                                pData.initializer = initText;
                        }

                        methData.params.push(pData);
                    }

                    this.methods.push(methData);
                }
                
            }
            
        }
        
    }


    addContentToDoc(tree) {
        let propsTable = buildPropsTable(this.props);
        let methodsList = buildMethodsList(this.methods);

        if (propsTable) {
            heading(tree, "Properties", (before, section, after) => {
                return [before, propsTable, after];
            });
        }

        if (methodsList) {
            heading(tree, "Methods", (before, section, after) => {
                return [before, methodsList, after];
            });
        }
    }
}


export function updatePhase(tree, pathname, aggData) {
    let fileNameNoSuffix = path.basename(pathname, ".md");

    let itemType = fileNameNoSuffix.match(/component|directive|service/);

    if (itemType) {
        let srcData = aggData.srcData[fileNameNoSuffix];

        if (srcData) {
            let srcPath = srcData.path;
            let className = fixAngularFilename(fileNameNoSuffix);
            
            let classData: NgDocAutoContent;

            if ((itemType[0] === "component") || (itemType[0] === "directive")) {
                classData = new ComponentDocAutoContent();
            } else if (itemType[0] === "service") {
                classData = new ServiceDocAutoContent();
            }

            getDocSourceData(path.resolve(".", srcPath), className, classData);
            classData.addContentToDoc(tree);
        }

        return true;
    } else {
        return false;
    }
}


function initialCap(str: string) {
    return str[0].toUpperCase() + str.substr(1);
}


function fixAngularFilename(rawName: string) {
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


function getDocSourceData(srcPath: string, docClassName: string, classData: NgDocAutoContent) {
    let prog = ts.createProgram([srcPath], {
        target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
    });

    let sourceFiles = prog.getSourceFiles();
    let checker = prog.getTypeChecker();

    for (var i = 0; i < sourceFiles.length; i++) {
        if (!sourceFiles[i].isDeclarationFile)
            ts.forEachChild(sourceFiles[i], visit);
    }

    function visit(node: ts.Node) {
        if (!isNodeExported(node))
            return;
        
        if (ts.isClassDeclaration(node) && node.name) {
            let classDec: ts.ClassDeclaration = node;
            let sourceFile = classDec.getSourceFile();
    
            if (classDec.name.escapedText === docClassName) {
                getPropDataFromClassChain(checker, classDec, classData);
            }
        }
    }
}


// Get properties/events from main class and all inherited classes.
function getPropDataFromClassChain(
    checker: ts.TypeChecker,
    classDec: ts.ClassDeclaration,
    classData: NgDocAutoContent
){ 
    // Main class
    classData.extractClassInfoFromSource(checker, classDec);

    // Inherited classes
    if (classDec.heritageClauses) {
        for(const hc of classDec.heritageClauses) {
            let hcType = checker.getTypeFromTypeNode(hc.types[0]);
            
            for (const dec of hcType.symbol.declarations) {
                if (isClassDeclaration(dec)) {
                    getPropDataFromClassChain(checker, dec, classData);
                }
            }
        }
    }

}


function buildPropsTable(props: PropData[], includeInitializer: boolean = true) {
    if (props.length === 0) {
        return null;
    }

    var headerCells = [
        unist.makeTableCell([unist.makeText("Name")]),
        unist.makeTableCell([unist.makeText("Type")])
    ];

    if (includeInitializer)
        headerCells.push(unist.makeTableCell([unist.makeText("Default value")]));

    headerCells.push(unist.makeTableCell([unist.makeText("Description")]));

    var rows = [
        unist.makeTableRow(headerCells)
    ];
    
    for (var i = 0; i < props.length; i++) {
        var pName = props[i].name;
        var pType = props[i].type;
        var pDesc = props[i].docText || "";

        if (pDesc) {
            pDesc = pDesc.replace(/[\n\r]+/, " ");
        }

        var descCellContent = remark().parse(pDesc).children;

        var pDefault = props[i].initializer || "";

        var defaultCellContent;

        if (pDefault) {
            if (pDefault.length > maxDefaultTextLength) {
                defaultCellContent = unist.makeText("See description");
                console.log(`Warning: property "${pName}" default value substituted (> ${maxDefaultTextLength} chars)`);
            } else
                defaultCellContent = unist.makeInlineCode(pDefault);
        } else {
            defaultCellContent = unist.makeText("");
        }
        
        var cells = [
            unist.makeTableCell([unist.makeText(pName)]),
            unist.makeTableCell([unist.makeInlineCode(pType)])
        ];

        if (includeInitializer)
            cells.push(unist.makeTableCell([defaultCellContent]));
        
        cells.push(unist.makeTableCell(descCellContent));
        
        rows.push(unist.makeTableRow(cells));
    }

    let spacers = [null, null, null];

    if (includeInitializer)
        spacers.push(null);

    return unist.makeTable(spacers, rows);
}


function buildMethodsList(methods: MethodData[]) {
    if (methods.length === 0)
        return null;
    
    let listItems = [];

    for (let method of methods) {
        let itemLines = [];

        itemLines.push(unist.makeInlineCode(method.getSignature()));
        itemLines.push(unist.makeBreak());
        itemLines.push(unist.makeParagraph(remark().parse(method.docText).children));
        itemLines.push(unist.makeBreak());

        let paramListItems = [];

        for (let param of method.params) {
            let currParamSections = [];

            if (param.docText !== "") {
                currParamSections.push(unist.makeInlineCode(param.name));

                let optionalPart = param.optional ? "(Optional) " : "";

                currParamSections.push(unist.makeText(" - " + optionalPart + param.docText));
                //currParamSections.push(unist.makeBreak());
                paramListItems.push(unist.makeListItem(unist.makeParagraph(currParamSections)));
            }
        }

        itemLines.push(unist.makeListUnordered(paramListItems));
        

        listItems.push(unist.makeListItem(unist.makeParagraph(itemLines)));
    }

    return unist.makeListUnordered(listItems);
}


function isNodeExported(node: ts.Node): boolean {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}