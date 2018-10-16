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
var ngHelpers_1 = require("../ngHelpers");
var libFolders = ["core", "content-services", "process-services", "insights", "process-services-cloud"];
var templateFolder = path.resolve("tools", "doc", "templates");
var excludePatterns = [
    "**/*.spec.ts"
];
var nameExceptions;
function processDocs(mdCache, aggData, _errorMessages) {
    //initPhase(aggData);
    nameExceptions = aggData.config.typeNameExceptions;
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
    /*
    let compName = angNameToClassName(path.basename(pathname, ".md"));
    let classRef = aggData.projData.findReflectionByName(compName);

    if (!classRef) {
        // A doc file with no corresponding class (eg, Document Library Model).
        return false;
    }

    let compData = new ComponentInfo(classRef);
    */
    var className = ngHelpers_1.ngNameToClassName(path.basename(pathname, ".md"), nameExceptions);
    var classTypeMatch = className.match(/component|directive|service/i);
    var compData = aggData.classInfo[className];
    if (classTypeMatch && compData) {
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
/*
function initialCap(str: string) {
    return str[0].toUpperCase() + str.substr(1);
}


function angNameToClassName(rawName: string) {
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
*/
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
            .text(function (t) { return true; }, 1).value; //item.value;
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
