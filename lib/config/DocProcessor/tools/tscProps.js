"use strict";
exports.__esModule = true;
var ts = require("typescript");
var path = require("path");
var heading = require("mdast-util-heading-range");
var remark = require("remark");
var unist = require("../unistHelpers");
var typescript_1 = require("typescript");
// Max number of characters in the text for the default value column.
var maxDefaultTextLength = 20;
function initPhase(aggData) {
}
exports.initPhase = initPhase;
function readPhase(tree, pathname, aggData) {
}
exports.readPhase = readPhase;
function aggPhase(aggData) {
}
exports.aggPhase = aggPhase;
var PropData = /** @class */ (function () {
    function PropData() {
    }
    return PropData;
}());
var ParamData = /** @class */ (function () {
    function ParamData() {
    }
    ParamData.prototype.getSignature = function () {
        var sig = this.name;
        if (this.optional)
            sig += "?";
        if (this.type)
            sig += ": " + this.type;
        if (this.initializer)
            sig += " = " + this.initializer;
        return sig;
    };
    return ParamData;
}());
var MethodData = /** @class */ (function () {
    function MethodData() {
        this.params = [];
    }
    MethodData.prototype.getSignature = function () {
        var sig = this.name + "(";
        if (this.params.length > 0) {
            sig += this.params[0].getSignature();
        }
        for (var i = 1; i < this.params.length; i++) {
            sig += ", " + this.params[i].getSignature();
        }
        sig += ")";
        if (this.returnType !== "void") {
            sig += ": " + this.returnType;
        }
        return sig;
    };
    return MethodData;
}());
var ComponentDocAutoContent = /** @class */ (function () {
    function ComponentDocAutoContent() {
        this.inputs = [];
        this.outputs = [];
    }
    ComponentDocAutoContent.prototype.extractClassInfoFromSource = function (checker, classDec) {
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
                        this.inputs.push({
                            "name": name_1,
                            "type": propType,
                            "initializer": initializer,
                            "docText": doc
                        });
                    }
                    else if (dec.match(/@Output/)) {
                        this.outputs.push({
                            "name": name_1,
                            "type": propType,
                            "initializer": "",
                            "docText": doc
                        });
                    }
                }
            }
        }
    };
    ComponentDocAutoContent.prototype.addContentToDoc = function (tree) {
        var inTable = buildPropsTable(this.inputs);
        var outTable = buildPropsTable(this.outputs, false);
        if (inTable) {
            heading(tree, "Properties", function (before, section, after) {
                return [before, inTable, after];
            });
        }
        if (outTable) {
            heading(tree, "Events", function (before, section, after) {
                return [before, outTable, after];
            });
        }
    };
    return ComponentDocAutoContent;
}());
var ServiceDocAutoContent = /** @class */ (function () {
    function ServiceDocAutoContent() {
        this.props = [];
        this.methods = [];
    }
    ServiceDocAutoContent.prototype.extractClassInfoFromSource = function (checker, classDec) {
        var sourceFile = classDec.getSourceFile();
        for (var i = 0; i < classDec.members.length; i++) {
            var member = classDec.members[i];
            if (ts.isMethodDeclaration(member)) {
                var method = member;
                var mods = ts.getCombinedModifierFlags(method);
                var nonPrivate = (mods & ts.ModifierFlags.Private) === 0;
                var memSymbol = checker.getSymbolAtLocation(method.name);
                if (nonPrivate && memSymbol) {
                    var methData = new MethodData();
                    methData.name = memSymbol.getName();
                    var doc = ts.displayPartsToString(memSymbol.getDocumentationComment());
                    if (!doc)
                        console.log("Warning: Method " + classDec.name.escapedText + "." + methData.name + " is not documented");
                    methData.docText = doc.replace(/\r\n/g, " ");
                    var sig = checker.getSignatureFromDeclaration(method);
                    var returnType = sig.getReturnType();
                    methData.returnType = checker.typeToString(returnType);
                    var returnSymbol = returnType.getSymbol();
                    var params = method.parameters;
                    for (var p = 0; p < params.length; p++) {
                        var pData = new ParamData();
                        pData.name = params[p].name.getText();
                        if (params[p].type)
                            pData.type = params[p].type.getText();
                        else
                            pData.type = "";
                        var paramSymbol = checker.getSymbolAtLocation(params[p].name);
                        pData.docText = ts.displayPartsToString(paramSymbol.getDocumentationComment());
                        if (!pData.docText)
                            console.log("Warning: Parameter \"" + pData.name + "\" of " + classDec.name.escapedText + "." + methData.name + " is not documented");
                        pData.optional = params[p].questionToken ? true : false;
                        if (params[p].initializer) {
                            var initText = params[p].initializer.getText();
                            if (initText !== "undefined")
                                pData.initializer = initText;
                        }
                        methData.params.push(pData);
                    }
                    this.methods.push(methData);
                }
            }
        }
    };
    ServiceDocAutoContent.prototype.addContentToDoc = function (tree) {
        var propsTable = buildPropsTable(this.props);
        var methodsList = buildMethodsList(this.methods);
        if (propsTable) {
            heading(tree, "Properties", function (before, section, after) {
                return [before, propsTable, after];
            });
        }
        if (methodsList) {
            heading(tree, "Methods", function (before, section, after) {
                return [before, methodsList, after];
            });
        }
    };
    return ServiceDocAutoContent;
}());
function updatePhase(tree, pathname, aggData) {
    var fileNameNoSuffix = path.basename(pathname, ".md");
    var itemType = fileNameNoSuffix.match(/component|directive|service/);
    if (itemType) {
        var srcData = aggData.srcData[fileNameNoSuffix];
        if (srcData) {
            var srcPath = srcData.path;
            var className = fixAngularFilename(fileNameNoSuffix);
            var classData = void 0;
            if ((itemType[0] === "component") || (itemType[0] === "directive")) {
                classData = new ComponentDocAutoContent();
            }
            else if (itemType[0] === "service") {
                classData = new ServiceDocAutoContent();
            }
            getDocSourceData(path.resolve(".", srcPath), className, classData);
            classData.addContentToDoc(tree);
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
function fixAngularFilename(rawName) {
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
function getDocSourceData(srcPath, docClassName, classData) {
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
                getPropDataFromClassChain(checker, classDec, classData);
            }
        }
    }
}
// Get properties/events from main class and all inherited classes.
function getPropDataFromClassChain(checker, classDec, classData) {
    // Main class
    classData.extractClassInfoFromSource(checker, classDec);
    // Inherited classes
    if (classDec.heritageClauses) {
        for (var _i = 0, _a = classDec.heritageClauses; _i < _a.length; _i++) {
            var hc = _a[_i];
            var hcType = checker.getTypeFromTypeNode(hc.types[0]);
            for (var _b = 0, _c = hcType.symbol.declarations; _b < _c.length; _b++) {
                var dec = _c[_b];
                if (typescript_1.isClassDeclaration(dec)) {
                    getPropDataFromClassChain(checker, dec, classData);
                }
            }
        }
    }
}
function buildPropsTable(props, includeInitializer) {
    if (includeInitializer === void 0) { includeInitializer = true; }
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
                console.log("Warning: property \"" + pName + "\" default value substituted (> " + maxDefaultTextLength + " chars)");
            }
            else
                defaultCellContent = unist.makeInlineCode(pDefault);
        }
        else {
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
    var spacers = [null, null, null];
    if (includeInitializer)
        spacers.push(null);
    return unist.makeTable(spacers, rows);
}
function buildMethodsList(methods) {
    if (methods.length === 0)
        return null;
    var listItems = [];
    for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
        var method = methods_1[_i];
        var itemLines = [];
        itemLines.push(unist.makeInlineCode(method.getSignature()));
        itemLines.push(unist.makeBreak());
        itemLines.push(unist.makeParagraph(remark().parse(method.docText).children));
        itemLines.push(unist.makeBreak());
        var paramListItems = [];
        for (var _a = 0, _b = method.params; _a < _b.length; _a++) {
            var param = _b[_a];
            var currParamSections = [];
            if (param.docText !== "") {
                currParamSections.push(unist.makeInlineCode(param.name));
                var optionalPart = param.optional ? "(Optional) " : "";
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
function isNodeExported(node) {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}
