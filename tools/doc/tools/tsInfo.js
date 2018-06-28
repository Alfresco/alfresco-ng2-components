"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var replaceSection = require("mdast-util-heading-range");
var remark = require("remark");
// import * as stringify from "remark-stringify";
// import * as frontMatter from "remark-frontmatter";
var ejs = require("ejs");
var typedoc_1 = require("typedoc");
var mdNav_1 = require("../mdNav");
var libFolders = ["core", "content-services", "process-services", "insights"];
var templateFolder = path.resolve("tools", "doc", "templates");
var excludePatterns = [
    "**/*.spec.ts"
];
var nameExceptions;
var undocMethodNames = {
    "ngOnChanges": 1
};
function processDocs(mdCache, aggData, _errorMessages) {
    initPhase(aggData);
    var pathnames = Object.keys(mdCache);
    var internalErrors;
    pathnames.forEach(function (pathname) {
        internalErrors = [];
        updateFile(mdCache[pathname].mdOutTree, pathname, aggData, internalErrors);
        if (internalErrors.length > 0) {
            showErrors(pathname, internalErrors);
        }
    });
}
exports.processDocs = processDocs;
function showErrors(filename, errorMessages) {
    console.log(filename);
    errorMessages.forEach(function (message) {
        console.log("    " + message);
    });
    console.log("");
}
var PropInfo = /** @class */ (function () {
    function PropInfo(rawProp) {
        var _this = this;
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
            rawProp.decorators.forEach(function (dec) {
                //console.log(dec);
                if (dec.name === "Input") {
                    _this.isInput = true;
                    if (dec.arguments) {
                        var bindingName = dec.arguments["bindingPropertyName"];
                        if (bindingName && (bindingName !== ""))
                            _this.name = bindingName.replace(/['"]/g, "");
                    }
                    if (!_this.docText && !_this.isDeprecated) {
                        _this.errorMessages.push("Warning: Input \"" + rawProp.name + "\" has no doc text.");
                    }
                }
                if (dec.name === "Output") {
                    _this.isOutput = true;
                    if (!_this.docText && !_this.isDeprecated) {
                        _this.errorMessages.push("Warning: Output \"" + rawProp.name + "\" has no doc text.");
                    }
                }
            });
        }
    }
    Object.defineProperty(PropInfo.prototype, "errors", {
        get: function () {
            return this.errorMessages;
        },
        enumerable: true,
        configurable: true
    });
    return PropInfo;
}());
;
var ParamInfo = /** @class */ (function () {
    function ParamInfo(rawParam) {
        this.name = rawParam.name;
        this.type = rawParam.type.toString().replace(/\s/g, "");
        this.defaultValue = rawParam.defaultValue;
        this.docText = rawParam.comment ? rawParam.comment.text : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
        this.isOptional = rawParam.flags.isOptional;
        this.combined = this.name;
        if (this.isOptional)
            this.combined += "?";
        this.combined += ": `" + this.type + "`";
        if (this.defaultValue !== "")
            this.combined += " = `" + this.defaultValue + "`";
    }
    return ParamInfo;
}());
var MethodSigInfo = /** @class */ (function () {
    function MethodSigInfo(rawSig) {
        var _this = this;
        this.errorMessages = [];
        this.name = rawSig.name;
        this.returnType = rawSig.type ? rawSig.type.toString().replace(/\s/g, "") : "";
        this.returnsSomething = this.returnType != "void";
        if (rawSig.hasComment()) {
            this.docText = rawSig.comment.shortText + rawSig.comment.text;
            this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
            if (!this.docText) {
                this.errorMessages.push("Warning: method \"" + rawSig.name + "\" has no doc text.");
            }
            this.returnDocText = rawSig.comment.returns;
            this.returnDocText = this.returnDocText ? this.returnDocText.replace(/[\n\r]+/g, " ").trim() : "";
            if (this.returnDocText.toLowerCase() === "nothing") {
                this.returnsSomething = false;
            }
            if (this.returnsSomething && !this.returnDocText) {
                this.errorMessages.push("Warning: Return value of method \"" + rawSig.name + "\" has no doc text.");
            }
            this.isDeprecated = rawSig.comment.hasTag("deprecated");
        }
        this.params = [];
        var paramStrings = [];
        if (rawSig.parameters) {
            rawSig.parameters.forEach(function (rawParam) {
                if (!rawParam.comment || !rawParam.comment.text) {
                    _this.errorMessages.push("Warning: parameter \"" + rawParam.name + "\" of method \"" + rawSig.name + "\" has no doc text.");
                }
                var param = new ParamInfo(rawParam);
                _this.params.push(param);
                paramStrings.push(param.combined);
            });
        }
        this.signature = "(" + paramStrings.join(", ") + ")";
    }
    Object.defineProperty(MethodSigInfo.prototype, "errors", {
        get: function () {
            return this.errorMessages;
        },
        enumerable: true,
        configurable: true
    });
    return MethodSigInfo;
}());
var ComponentInfo = /** @class */ (function () {
    function ComponentInfo(classRef) {
        var _this = this;
        var props = classRef.getChildrenByKind(typedoc_1.ReflectionKind.Property);
        var accessors = classRef.getChildrenByKind(typedoc_1.ReflectionKind.Accessor);
        this.properties = props.concat(accessors).map(function (item) {
            return new PropInfo(item);
        });
        var methods = classRef.getChildrenByKind(typedoc_1.ReflectionKind.Method);
        this.methods = [];
        methods.forEach(function (method) {
            if (!(method.flags.isPrivate || method.flags.isProtected || undocMethodNames[method.name])) {
                method.signatures.forEach(function (sig) {
                    _this.methods.push(new MethodSigInfo(sig));
                });
            }
        });
        this.hasInputs = false;
        this.hasOutputs = false;
        this.properties.forEach(function (prop) {
            if (prop.isInput)
                _this.hasInputs = true;
            if (prop.isOutput)
                _this.hasOutputs = true;
        });
        this.hasMethods = methods.length > 0;
    }
    Object.defineProperty(ComponentInfo.prototype, "errors", {
        get: function () {
            var combinedErrors = [];
            this.methods.forEach(function (method) {
                method.errors.forEach(function (err) {
                    combinedErrors.push(err);
                });
            });
            this.properties.forEach(function (prop) {
                prop.errors.forEach(function (err) {
                    combinedErrors.push(err);
                });
            });
            return combinedErrors;
        },
        enumerable: true,
        configurable: true
    });
    return ComponentInfo;
}());
function initPhase(aggData) {
    nameExceptions = aggData.config.typeNameExceptions;
    var app = new typedoc_1.Application({
        exclude: excludePatterns,
        ignoreCompilerErrors: true,
        experimentalDecorators: true,
        tsconfig: "tsconfig.json"
    });
    var sources = app.expandInputFiles(libFolders.map(function (folder) {
        return path.resolve("lib", folder);
    }));
    aggData.projData = app.convert(sources);
}
function updateFile(tree, pathname, aggData, errorMessages) {
    var compName = angNameToClassName(path.basename(pathname, ".md"));
    var classRef = aggData.projData.findReflectionByName(compName);
    if (!classRef) {
        // A doc file with no corresponding class (eg, Document Library Model).
        return false;
    }
    var compData = new ComponentInfo(classRef);
    var classTypeMatch = compName.match(/component|directive|service/i);
    if (classTypeMatch) {
        var classType = classTypeMatch[0].toLowerCase();
        // Copy docs back from the .md file when the JSDocs are empty.
        var inputMD = getPropDocsFromMD(tree, "Properties", 3);
        var outputMD = getPropDocsFromMD(tree, "Events", 2);
        updatePropDocsFromMD(compData, inputMD, outputMD, errorMessages);
        if (classType === "service") {
            var methodMD = getMethodDocsFromMD(tree);
            updateMethodDocsFromMD(compData, methodMD, errorMessages);
        }
        var templateName = path.resolve(templateFolder, classType + ".ejs");
        var templateSource = fs.readFileSync(templateName, "utf8");
        var template = ejs.compile(templateSource);
        var mdText = template(compData);
        mdText = mdText.replace(/^ +\|/mg, "|");
        var newSection_1 = remark().parse(mdText.trim()).children;
        replaceSection(tree, "Class members", function (before, section, after) {
            newSection_1.unshift(before);
            newSection_1.push(after);
            return newSection_1;
        });
        compData.errors.forEach(function (err) {
            errorMessages.push(err);
        });
    }
    return true;
}
function initialCap(str) {
    return str[0].toUpperCase() + str.substr(1);
}
function angNameToClassName(rawName) {
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
    var result = {};
    var nav = new mdNav_1.MDNav(tree);
    var classMemHeading = nav
        .heading(function (h) {
        return (h.children[0].type === "text") && (h.children[0].value === "Class members");
    });
    var propsTable = classMemHeading
        .heading(function (h) {
        return (h.children[0].type === "text") && (h.children[0].value === sectionHeading);
    }).table();
    var propTableRow = propsTable.childNav
        .tableRow(function () { return true; }, 1).childNav;
    var i = 1;
    while (!propTableRow.empty) {
        var propName = propTableRow
            .tableCell().childNav
            .text().item.value;
        var propDocText = propTableRow
            .tableCell(function () { return true; }, docsColumn).childNav
            .text().item;
        if (propDocText) {
            result[propName] = propDocText.value;
        }
        i++;
        propTableRow = propsTable.childNav
            .tableRow(function () { return true; }, i).childNav;
    }
    return result;
}
function getMethodDocsFromMD(tree) {
    var result = {};
    var nav = new mdNav_1.MDNav(tree);
    var classMemHeading = nav
        .heading(function (h) {
        return (h.children[0].type === "text") && (h.children[0].value === "Class members");
    });
    var methListItems = classMemHeading
        .heading(function (h) {
        return (h.children[0].type === "text") && (h.children[0].value === "Methods");
    }).list().childNav;
    var methItem = methListItems
        .listItem();
    var i = 0;
    while (!methItem.empty) {
        var methNameSection = methItem.childNav
            .paragraph().childNav
            .strong().childNav;
        var methName = '';
        // Method docs must be in "new" format with names and types styled separately.
        if (!methNameSection.empty) {
            methName = methNameSection.text().item.value;
            var methDoc = methItem.childNav
                .paragraph().childNav
                .html()
                .text().value;
            var params = getMDMethodParams(methItem);
            result[methName] = {
                "docText": methDoc.replace(/^\n/, ""),
                "params": params
            };
        }
        i++;
        methItem = methListItems
            .listItem(function (l) { return true; }, i);
    }
    /*
    let newRoot = unist.makeRoot([methList.item]);
    console.log(remark().use(frontMatter, {type: 'yaml', fence: '---'}).data("settings", {paddedTable: false, gfm: false}).stringify(tree));
    */
    return result;
}
function getMDMethodParams(methItem) {
    var result = {};
    var paramList = methItem.childNav.list().childNav;
    var paramListItems = paramList
        .listItems();
    paramListItems.forEach(function (paramListItem) {
        var paramNameNode = paramListItem.childNav
            .paragraph().childNav
            .emph().childNav;
        var paramName;
        if (!paramNameNode.empty) {
            paramName = paramNameNode.text().item.value.replace(/:/, "");
        }
        else {
            paramName = paramListItem.childNav
                .paragraph().childNav
                .strong().childNav
                .text().item.value;
        }
        var paramDoc = paramListItem.childNav
            .paragraph().childNav
            .text(function (t) { return true; }, 1).item.value;
        result[paramName] = paramDoc.replace(/^[ -]+/, "");
    });
    return result;
}
function updatePropDocsFromMD(comp, inputDocs, outputDocs, errorMessages) {
    comp.properties.forEach(function (prop) {
        var propMDDoc;
        if (prop.isInput) {
            propMDDoc = inputDocs[prop.name];
        }
        else if (prop.isOutput) {
            propMDDoc = outputDocs[prop.name];
        }
        // If JSDocs are empty but MD docs aren't then the Markdown is presumably more up-to-date.
        if (!prop.docText && propMDDoc) {
            prop.docText = propMDDoc;
            errorMessages.push("Warning: empty JSDocs for property \"" + prop.name + "\" may need sync with the .md file.");
        }
    });
}
function updateMethodDocsFromMD(comp, methodDocs, errorMessages) {
    comp.methods.forEach(function (meth) {
        var currMethMD = methodDocs[meth.name];
        // If JSDocs are empty but MD docs aren't then the Markdown is presumably more up-to-date.
        if (!meth.docText && currMethMD && currMethMD.docText) {
            meth.docText = currMethMD.docText;
            errorMessages.push("Warning: empty JSDocs for method sig \"" + meth.name + "\" may need sync with the .md file.");
        }
        meth.params.forEach(function (param) {
            if (!param.docText && currMethMD && currMethMD.params[param.name]) {
                param.docText = currMethMD.params[param.name];
                errorMessages.push("Warning: empty JSDocs for parameter \"" + param.name + " (" + meth.name + ")\" may need sync with the .md file.");
            }
        });
    });
}
