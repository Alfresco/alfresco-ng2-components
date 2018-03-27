"use strict";
exports.__esModule = true;
var path = require("path");
var liquid = require("liquidjs");
var typedoc_1 = require("typedoc");
var libFolders = ["content-services"]; //["core", "content-services", "process-services", "insights"];
var templateFolder = path.resolve(".", "config", "DocProcessor", "templates");
var excludePatterns = [
    "**/*.spec.ts"
];
var propTemp = "{% for prop in properties %}\n| {{prop.name}} | {{prop.type}} | {{prop.defaultValue}} | {{prop.docText}} |\n{% endfor %}";
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
        this.defaultValue = rawProp.defaultValue;
        this.type = rawProp.type ? rawProp.type.toString() : "";
        if (rawProp.decorators) {
            rawProp.decorators.forEach(function (dec) {
                if (dec.name === "Input")
                    _this.isInput = true;
                if (dec.name === "Output")
                    _this.isOutput = true;
            });
        }
        if (rawProp.comment && rawProp.comment.tags) {
            rawProp.comment.tags.forEach(function (tag) {
                if (tag.tagName === "deprecated")
                    _this.isDeprecated = true;
            });
        }
    }
    return PropInfo;
}());
;
var MethodInfo = /** @class */ (function () {
    function MethodInfo(rawMeth) {
        var _this = this;
        this.name = rawMeth.name;
        this.docText = rawMeth.hasComment() ? rawMeth.comment.shortText + rawMeth.comment.text : "";
        this.docText = this.docText.replace(/[\n\r]+/g, " ");
        this.returnType = rawMeth.type ? rawMeth.type.toString() : "";
        this.signatures = [];
        if (rawMeth.signatures) {
            rawMeth.signatures.forEach(function (item) {
                var sigString = "(";
                if (item.parameters) {
                    var paramStrings_1 = [];
                    item.parameters.forEach(function (param) {
                        paramStrings_1.push(param.name + ": " + param.type.toString());
                    });
                    sigString += paramStrings_1.join(", ");
                }
                sigString += ")";
                _this.signatures.push(sigString);
            });
        }
        //sigs && sigs.length > 0 ? sigs[0].toString() : "";
    }
    return MethodInfo;
}());
var ComponentInfo = /** @class */ (function () {
    function ComponentInfo(classRef) {
        var props = classRef.getChildrenByKind(typedoc_1.ReflectionKind.Property);
        this.properties = props.map(function (item) {
            return new PropInfo(item);
        });
        var methods = classRef.getChildrenByKind(typedoc_1.ReflectionKind.Method);
        this.methods = methods.map(function (item) {
            return new MethodInfo(item);
        });
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
    aggData.liq
        .renderFile("propTable.md", compData)
        .then(console.log);
}
exports.updatePhase = updatePhase;
function hasDeprecatedTag(tags) {
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].tagName === "deprecated")
            return tags[i].text.trim();
    }
    return "";
}
function hasInputDecorator(decs) {
    for (var i = 0; i < decs.length; i++) {
        if (decs[i].name === "Input")
            return true;
    }
    return false;
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
