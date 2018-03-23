"use strict";
exports.__esModule = true;
var path = require("path");
var typedoc_1 = require("typedoc");
var libFolders = ["content-services"]; //["core", "content-services", "process-services", "insights"];
var excludePatterns = [
    "**/*.spec.ts"
];
var nameExceptions = {
    "datatable.component": "DataTableComponent",
    "tasklist.service": "TaskListService"
};
var PropInfo = /** @class */ (function () {
    function PropInfo() {
    }
    return PropInfo;
}());
;
function initPhase(aggData) {
    var app = new typedoc_1.Application({
        exclude: excludePatterns,
        ignoreCompilerErrors: true
    });
    var sources = app.expandInputFiles(libFolders);
    aggData.projData = app.convert(sources);
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
    var ref = aggData.projData.findReflectionByName(compName);
    ref.traverse(traverse);
    function traverse(childRef, travProp) {
        if (childRef.kind === typedoc_1.ReflectionKind.Property) {
            if (childRef.decorators && hasInputDecorator(childRef.decorators)) {
                var propName = childRef.name;
                var docText = childRef.comment ? childRef.comment.shortText : "";
                if (childRef.comment && childRef.comment.tags) {
                    var depValue = hasDeprecatedTag(childRef.comment.tags);
                    if (depValue != "")
                        docText = "(Deprecated " + depValue + ") " + docText;
                }
                var defaultValue = childRef.defaultValue;
                var type = childRef.type.toString();
                console.log("| " + propName + " | " + type + " | " + defaultValue + " | " + docText + " |");
            }
        }
    }
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
/*
function getPropertyInfo(propRef: Reflection): PropInfo {
    let info = new PropInfo();
    
    info.name = propRef.name;
    info.docText = propRef.comment ? propRef.comment.shortText : "";

    propRef.traverse(traverse);

    
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
