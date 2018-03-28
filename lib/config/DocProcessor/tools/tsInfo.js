"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var replaceSection = require("mdast-util-heading-range");
var remark = require("remark");
var frontMatter = require("remark-frontmatter");
var liquid = require("liquidjs");
var typedoc_1 = require("typedoc");
var libFolders = ["content-services"]; //["core", "content-services", "process-services", "insights"];
var templateFolder = path.resolve(".", "config", "DocProcessor", "templates");
var excludePatterns = [
    "**/*.spec.ts"
];
var nameExceptions = {
    "datatable.component": "DataTableComponent",
    "tasklist.service": "TaskListService"
};
var PropInfo = /** @class */ (function () {
    function PropInfo(rawProp) {
        var _this = this;
        this.name = rawProp.name;
        this.docText = rawProp.comment ? rawProp.comment.shortText : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ");
        this.defaultValue = rawProp.defaultValue || "";
        this.defaultValue = this.defaultValue.replace(/\|/, "\\|");
        this.type = rawProp.type ? rawProp.type.toString() : "";
        if (rawProp.decorators) {
            rawProp.decorators.forEach(function (dec) {
                if (dec.name === "Input")
                    _this.isInput = true;
                if (dec.name === "Output")
                    _this.isOutput = true;
            });
        }
        this.isDeprecated = rawProp.comment && rawProp.comment.hasTag("deprecated");
    }
    return PropInfo;
}());
;
var ParamInfo = /** @class */ (function () {
    function ParamInfo(rawParam) {
        this.name = rawParam.name;
        this.type = rawParam.type.toString();
        this.defaultValue = rawParam.defaultValue;
        this.docText = rawParam.comment ? rawParam.comment.text : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ");
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
        this.name = rawSig.name;
        this.docText = rawSig.hasComment() ? rawSig.comment.shortText + rawSig.comment.text : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ");
        this.returnType = rawSig.type ? rawSig.type.toString() : "";
        this.isDeprecated = rawSig.comment && rawSig.comment.hasTag("deprecated");
        this.params = [];
        var paramStrings = [];
        if (rawSig.parameters) {
            rawSig.parameters.forEach(function (rawParam) {
                var param = new ParamInfo(rawParam);
                _this.params.push(param);
                paramStrings.push(param.combined);
            });
        }
        this.signature = "(" + paramStrings.join(", ") + ")";
    }
    return MethodSigInfo;
}());
var ComponentInfo = /** @class */ (function () {
    function ComponentInfo(classRef) {
        var _this = this;
        var props = classRef.getChildrenByKind(typedoc_1.ReflectionKind.Property);
        this.properties = props.map(function (item) {
            return new PropInfo(item);
        });
        var methods = classRef.getChildrenByKind(typedoc_1.ReflectionKind.Method);
        this.methods = [];
        methods.forEach(function (method) {
            if (!(method.flags.isPrivate || method.flags.isProtected)) {
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
    return ComponentInfo;
}());
function initPhase(aggData) {
    var app = new typedoc_1.Application({
        exclude: excludePatterns,
        ignoreCompilerErrors: true
    });
    var sources = app.expandInputFiles(libFolders);
    aggData.projData = app.convert(sources);
    aggData.liq = liquid({
        root: templateFolder
    });
}
exports.initPhase = initPhase;
function readPhase(tree, pathname, aggData) {
}
exports.readPhase = readPhase;
function aggPhase(aggData) {
}
exports.aggPhase = aggPhase;
function updatePhase(tree, pathname, aggData) {
    var compName = angNameToClassName(path.basename(pathname, ".md"));
    var classRef = aggData.projData.findReflectionByName(compName);
    var compData = new ComponentInfo(classRef);
    var classType = compName.match(/component|directive|service/i);
    if (classType) {
        var templateName = classType[0] + ".liquid";
        aggData.liq
            .renderFile(templateName, compData)
            .then(function (mdText) {
            var newSection = remark().parse(mdText).children;
            replaceSection(tree, "Class members", function (before, section, after) {
                newSection.unshift(before);
                newSection.push(after);
                return newSection;
            });
            fs.writeFileSync(pathname, remark().use(frontMatter, { type: 'yaml', fence: '---' }).data("settings", { paddedTable: false }).stringify(tree));
        });
    }
    return false;
}
exports.updatePhase = updatePhase;
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
