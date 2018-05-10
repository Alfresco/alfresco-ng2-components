"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var replaceSection = require("mdast-util-heading-range");
var remark = require("remark");
var combyne = require("combyne");
var typedoc_1 = require("typedoc");
var libFolders = ["core", "content-services", "process-services", "insights"];
var templateFolder = path.resolve("..", "tools", "doc", "templates");
var excludePatterns = [
    "**/*.spec.ts"
];
var nameExceptions = {
    "datatable.component": "DataTableComponent",
    "tasklist.service": "TaskListService",
    "text-mask.component": "InputMaskDirective",
    "card-item-types.service": "CardItemTypeService"
};
var undocMethodNames = {
    "ngOnChanges": 1
};
var PropInfo = /** @class */ (function () {
    function PropInfo(rawProp) {
        var _this = this;
        this.errorMessages = [];
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
        this.type = rawParam.type.toString();
        this.defaultValue = rawParam.defaultValue;
        this.docText = rawParam.comment ? rawParam.comment.text : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ").trim();
        this.isOptional = rawParam.flags.isOptional;
        this.combined = this.name;
        if (this.isOptional)
            this.combined += "?";
        this.combined += ": " + this.type;
        if (this.defaultValue !== "")
            this.combined += " = " + this.defaultValue;
    }
    return ParamInfo;
}());
var MethodSigInfo = /** @class */ (function () {
    function MethodSigInfo(rawSig) {
        var _this = this;
        this.errorMessages = [];
        this.name = rawSig.name;
        this.returnType = rawSig.type ? rawSig.type.toString() : "";
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
    var app = new typedoc_1.Application({
        exclude: excludePatterns,
        ignoreCompilerErrors: true,
        experimentalDecorators: true,
        tsconfig: "tsconfig.json"
    });
    var sources = app.expandInputFiles(libFolders);
    aggData.projData = app.convert(sources);
    /*
    aggData.liq = liquid({
        root: templateFolder
    });
    */
}
exports.initPhase = initPhase;
function readPhase(tree, pathname, aggData) {
}
exports.readPhase = readPhase;
function aggPhase(aggData) {
}
exports.aggPhase = aggPhase;
function updatePhase(tree, pathname, aggData, errorMessages) {
    var compName = angNameToClassName(path.basename(pathname, ".md"));
    var classRef = aggData.projData.findReflectionByName(compName);
    if (!classRef) {
        // A doc file with no corresponding class (eg, Document Library Model).
        return false;
    }
    var compData = new ComponentInfo(classRef);
    var classType = compName.match(/component|directive|service/i);
    if (classType) {
        var templateName = path.resolve(templateFolder, classType + ".combyne");
        var templateSource = fs.readFileSync(templateName, "utf8");
        var template = combyne(templateSource);
        var mdText = template.render(compData);
        mdText = mdText.replace(/^ +\|/mg, "|");
        var newSection_1 = remark().data("settings", { paddedTable: false, gfm: false }).parse(mdText.trim()).children;
        replaceSection(tree, "Class members", function (before, section, after) {
            newSection_1.unshift(before);
            newSection_1.push(after);
            return newSection_1;
        });
        compData.errors.forEach(function (err) {
            errorMessages.push(err);
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
exports.updatePhase = updatePhase;
/*
function renderInputs(comp: ComponentInfo): string {
    var result = "";

    comp.properties.forEach(prop => {
        result += `| ${prop.name} | \`${prop.type}\` | ${prop.defaultValue} | ${prop.docText} |\n`;
    });

    return result;
}
*/
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
