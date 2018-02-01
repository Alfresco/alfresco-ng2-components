"use strict";
exports.__esModule = true;
var ts = require("typescript");
var path = require("path");
var heading = require("mdast-util-heading-range");
var remark = require("remark");
var unist = require("../unistHelpers");
var typescript_1 = require("typescript");
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
                heading(tree, "Properties", function (before, section, after) {
                    return [before, inTable_1, after];
                });
            }
            if (outTable_1) {
                heading(tree, "Events", function (before, section, after) {
                    return [before, outTable_1, after];
                });
            }
        }
        return true;
    }
    else {
        return false;
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
    var prog = ts.createProgram([srcPath], {
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
                getPropDataFromClassChain(checker, classDec, inputs, outputs);
            }
        }
    }
}
// Get properties/events from main class and all inherited classes.
function getPropDataFromClassChain(checker, classDec, inputs, outputs) {
    // Main class
    getPropDataFromClass(checker, classDec, inputs, outputs);
    // Inherited classes
    if (classDec.heritageClauses) {
        for (var _i = 0, _a = classDec.heritageClauses; _i < _a.length; _i++) {
            var hc = _a[_i];
            var hcType = checker.getTypeFromTypeNode(hc.types[0]);
            for (var _b = 0, _c = hcType.symbol.declarations; _b < _c.length; _b++) {
                var dec = _c[_b];
                if (typescript_1.isClassDeclaration(dec)) {
                    getPropDataFromClassChain(checker, dec, inputs, outputs);
                }
            }
        }
    }
}
function getPropDataFromClass(checker, classDec, inputs, outputs) {
    var sourceFile = classDec.getSourceFile();
    for (var i = 0; i < classDec.members.length; i++) {
        var member = classDec.members[i];
        if (ts.isPropertyDeclaration(member) ||
            ts.isGetAccessorDeclaration(member) ||
            ts.isSetAccessorDeclaration(member)) {
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
                var doc = ts.displayPartsToString(memSymbol.getDocumentationComment(checker));
                doc = doc.replace(/\r\n/g, " ");
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
        var pDefault = inputs[i].init || "";
        var pDesc = inputs[i].docText || "";
        if (pDesc) {
            //pDesc = pDesc.trim().replace(/[\n\r]+/, " ");
            pDesc = pDesc.replace(/[\n\r]+/, " ");
        }
        var descCellContent = remark().parse(pDesc).children;
        var defaultCellContent;
        if (pDefault) {
            /*
            descCellContent.push(unist.makeHTML("<br/>"));
            descCellContent.push(unist.makeText(" Default value: "));
            descCellContent.push(unist.makeInlineCode(pDefault));
            */
            defaultCellContent = unist.makeInlineCode(pDefault);
        }
        else {
            defaultCellContent = unist.makeText("");
        }
        var cells = [
            unist.makeTableCell([unist.makeText(pName)]),
            unist.makeTableCell([unist.makeInlineCode(pType)]),
            //unist.makeTableCell([unist.makeInlineCode(pDefault)]),
            unist.makeTableCell([defaultCellContent]),
            unist.makeTableCell(descCellContent)
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
        var eDesc = outputs[i].docText || "";
        if (eDesc) {
            eDesc = eDesc.trim().replace(/[\n\r]+/, ' ');
        }
        var cells = [
            unist.makeTableCell([unist.makeText(eName)]),
            unist.makeTableCell([unist.makeInlineCode(eType)]),
            unist.makeTableCell(remark().parse(eDesc).children)
        ];
        rows.push(unist.makeTableRow(cells));
    }
    return unist.makeTable([null, null, null], rows);
}
function isNodeExported(node) {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}
