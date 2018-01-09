"use strict";
exports.__esModule = true;
var ts = require("typescript");
var path = require("path");
var program = require("commander");
var heading = require("mdast-util-heading-range");
var unist = require("../unistHelpers");
function initPhase(aggData) {
}
exports.initPhase = initPhase;
function readPhase(tree, pathname, aggData) {
}
exports.readPhase = readPhase;
function aggPhase(aggData) {
}
exports.aggPhase = aggPhase;
function updatePhase(tree, pathname, aggData) {
    var fileNameNoSuffix = path.basename(pathname, ".md");
    if (fileNameNoSuffix.match(/component/)) {
        var srcData = aggData.srcData[fileNameNoSuffix];
        if (srcData) {
            var srcPath = srcData.path;
            var className = fixCompodocFilename(fileNameNoSuffix);
            var inputs = [];
            var outputs = [];
            getPropDocData(path.resolve(".", srcPath), className, inputs, outputs);
            var inTable_1 = buildInputsTable(inputs);
            var outTable_1 = buildOutputsTable(outputs);
            if (inTable_1) {
                console.log("Made a props table");
                heading(tree, "Properties", function (before, section, after) {
                    return [before, inTable_1, after];
                });
            }
            if (outTable_1) {
                console.log("Made an events table");
                heading(tree, "Events", function (before, section, after) {
                    return [before, outTable_1, after];
                });
            }
        }
    }
}
exports.updatePhase = updatePhase;
function initialCap(str) {
    return str[0].toUpperCase() + str.substr(1);
}
function fixCompodocFilename(rawName) {
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
function getPropDocData(srcPath, docClassName, inputs, outputs) {
    var prog = ts.createProgram(program.args, {
        target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
    });
    var sourceFiles = prog.getSourceFiles();
    var checker = prog.getTypeChecker();
    for (var i = 0; i < sourceFiles.length; i++) {
        if (!sourceFiles[i].isDeclarationFile)
            ts.forEachChild(sourceFiles[i], visit);
    }
    function visit(node) {
        if (!isNodeExported(node))
            return;
        if (ts.isClassDeclaration(node) && node.name) {
            var classDec = node;
            var sourceFile = classDec.getSourceFile();
            if (classDec.name.escapedText === docClassName) {
                getPropDataFromClass(checker, classDec, inputs, outputs);
            }
        }
    }
}
function getPropDataFromClass(checker, classDec, inputs, outputs) {
    var sourceFile = classDec.getSourceFile();
    for (var i = 0; i < classDec.members.length; i++) {
        var member = classDec.members[i];
        if (ts.isPropertyDeclaration(member)) {
            var prop = member;
            var mods = ts.getCombinedModifierFlags(prop);
            var nonPrivate = (mods & ts.ModifierFlags.Private) === 0;
            var memSymbol = checker.getSymbolAtLocation(prop.name);
            if (nonPrivate && memSymbol && prop.decorators) {
                var name_1 = memSymbol.getName();
                var initializer = "";
                if (prop.initializer) {
                    initializer = prop.initializer.getText(sourceFile);
                }
                var doc = ts.displayPartsToString(memSymbol.getDocumentationComment());
                var propType = checker.typeToString(checker.getTypeOfSymbolAtLocation(memSymbol, memSymbol.valueDeclaration));
                var dec = prop.decorators[0].getText(sourceFile);
                if (dec.match(/@Input/)) {
                    inputs.push({
                        "name": name_1,
                        "type": propType,
                        "init": initializer,
                        "docText": doc
                    });
                }
                else if (dec.match(/@Output/)) {
                    outputs.push({
                        "name": name_1,
                        "type": propType,
                        "docText": doc
                    });
                }
            }
        }
    }
}
function buildInputsTable(inputs) {
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
function buildOutputsTable(outputs) {
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
    for (var i = 0; i < outputs.length; i++) {
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
function isNodeExported(node) {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}
