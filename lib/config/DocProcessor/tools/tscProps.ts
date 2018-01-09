import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import * as program from "commander";

import * as heading from "mdast-util-heading-range";

import * as unist from "../unistHelpers";

export function initPhase(aggData) {
}

export function readPhase(tree, pathname, aggData) {
}

export function aggPhase(aggData) {
}

export function updatePhase(tree, pathname, aggData) {
    let fileNameNoSuffix = path.basename(pathname, ".md");

    if (fileNameNoSuffix.match(/component/)) {
        let srcData = aggData.srcData[fileNameNoSuffix];

        if (srcData) {
            let srcPath = srcData.path;
            let className = fixCompodocFilename(fileNameNoSuffix);

            let inputs = [];
            let outputs = [];
            getPropDocData(path.resolve(".", srcPath), className, inputs, outputs);

            let inTable = buildInputsTable(inputs);
            let outTable = buildOutputsTable(outputs);

            if (inTable) {
                console.log("Made a props table");
                heading(tree, "Properties", (before, section, after) => {
                    return [before, inTable, after];
                });
            }

            if (outTable) {
                console.log("Made an events table");
                heading(tree, "Events", (before, section, after) => {
                    return [before, outTable, after];
                });
            }
        }
    }
}


function initialCap(str: string) {
    return str[0].toUpperCase() + str.substr(1);
}


function fixCompodocFilename(rawName: string) {
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


function getPropDocData(srcPath: string, docClassName: string, inputs: any[], outputs: any[]) {
    let prog = ts.createProgram(program.args, {
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
                getPropDataFromClass(checker, classDec, inputs, outputs);
            }
        }
    }
}


function getPropDataFromClass(
    checker: ts.TypeChecker,
    classDec:ts.ClassDeclaration,
    inputs: any[],
    outputs: any[]
){
    let sourceFile = classDec.getSourceFile();

    for (var i = 0; i < classDec.members.length; i++) {
        let member = classDec.members[i];

        if (ts.isPropertyDeclaration(member)) {
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
                
                let doc = ts.displayPartsToString(memSymbol.getDocumentationComment());
                let propType = checker.typeToString(checker.getTypeOfSymbolAtLocation(memSymbol, memSymbol.valueDeclaration!));
                
                let dec = prop.decorators[0].getText(sourceFile);
            
                if (dec.match(/@Input/)) {
                    inputs.push({
                        "name": name,
                        "type": propType,
                        "init": initializer,
                        "docText": doc
                    });
                } else if (dec.match(/@Output/)) {
                    outputs.push({
                        "name": name,
                        "type": propType,
                        "docText": doc
                    });
                }
            }
        }
    }
}


function buildInputsTable(inputs: any[]) {
    if (inputs.length === 0) {
        return null;
    }

    var rows = [
        unist.makeTableRow([
            unist.makeTableCell([unist.makeText("Name")]),
            unist.makeTableCell([unist.makeText("Type")]),
            unist.makeTableCell([unist.makeText("Default value")]),
            unist.makeTableCell([unist.makeText("Description")])
        ])
    ];
    
    for (var i = 0; i < inputs.length; i++) {
        var pName = inputs[i].name;
        var pType = inputs[i].type;
        var pDefault = inputs[i].defaultValue || "";
        var pDesc = inputs[i].description || "";

        if (pDesc) {
            pDesc = pDesc.trim().replace(/[\n\r]+/, " ");
        }

        var cells = [
            unist.makeTableCell([unist.makeText(pName)]),
            unist.makeTableCell([unist.makeText(pType)]),
            unist.makeTableCell([unist.makeText(pDefault)]),
            unist.makeTableCell([unist.makeText(pDesc)])
        ];

        rows.push(unist.makeTableRow(cells));
    }

    return unist.makeTable([null, null, null, null], rows);
}


function buildOutputsTable(outputs: any[]) {
    if (outputs.length === 0) {
        return null;
    }

    var rows = [
        unist.makeTableRow([
            unist.makeTableCell([unist.makeText("Name")]),
            unist.makeTableCell([unist.makeText("Type")]),
            unist.makeTableCell([unist.makeText("Description")])
        ])
    ];
    
    for (var i = 0; i < outputs.length; i++){
        var eName = outputs[i].name;
        var eType = outputs[i].type;
        var eDesc = outputs[i].description || "";

        if (eDesc) {
            eDesc = eDesc.trim().replace(/[\n\r]+/, ' ');
        }

        var cells = [
            unist.makeTableCell([unist.makeText(eName)]),
            unist.makeTableCell([unist.makeText(eType)]),
            unist.makeTableCell([unist.makeText(eDesc)])
        ];

        rows.push(unist.makeTableRow(cells));
    }

    return unist.makeTable([null, null, null], rows);
}

function isNodeExported(node: ts.Node): boolean {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}