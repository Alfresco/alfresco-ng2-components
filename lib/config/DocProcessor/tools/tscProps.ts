import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import * as program from "commander";

import * as heading from "mdast-util-heading-range";
import * as remark from "remark";

import * as unist from "../unistHelpers";
import { JsxEmit, isClassDeclaration, PropertyDeclaration } from "typescript";

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


export function updatePhase(tree, pathname, aggData) {
    let fileNameNoSuffix = path.basename(pathname, ".md");

    let itemType = fileNameNoSuffix.match(/component|service/);

    if (itemType) {
        let srcData = aggData.srcData[fileNameNoSuffix];

        if (srcData) {
            let srcPath = srcData.path;
            let className = fixAngularFilename(fileNameNoSuffix);
            
            let classData: NgDocAutoContent;

            if (itemType[0] === "component") {
                classData = new ComponentDocAutoContent();
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
        var pDefault = props[i].initializer || "";
        var pDesc = props[i].docText || "";

        if (pDesc) {
            pDesc = pDesc.replace(/[\n\r]+/, " ");
        }

        var descCellContent = remark().parse(pDesc).children;

        var defaultCellContent;

        if (pDefault) {
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


function isNodeExported(node: ts.Node): boolean {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}