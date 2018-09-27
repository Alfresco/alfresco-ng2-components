import * as fs from "fs";
import * as path from "path";

import * as replaceSection from "mdast-util-heading-range";
import * as remark from "remark";
// import * as stringify from "remark-stringify";
// import * as frontMatter from "remark-frontmatter";

import * as ejs from "ejs";

import {
    Application,
 } from "typedoc";

import { MDNav } from "../mdNav";
import { ngNameToClassName } from "../ngHelpers";

import {
    ComponentInfo
} from "../SourceInfoClasses"


let libFolders = ["core", "content-services", "process-services", "insights", "process-services-cloud"];
let templateFolder = path.resolve("tools", "doc", "templates");

let excludePatterns = [
    "**/*.spec.ts"
];


let nameExceptions;


export function processDocs(mdCache, aggData, _errorMessages) {
    //initPhase(aggData);

    nameExceptions = aggData.config.typeNameExceptions;

    let pathnames = Object.keys(mdCache);
    let internalErrors;

    pathnames.forEach(pathname => {
        internalErrors = [];
        updateFile(mdCache[pathname].mdOutTree, pathname, aggData, internalErrors);

        if (internalErrors.length > 0) {
            showErrors(pathname, internalErrors);
        }
    });
}


function showErrors(filename, errorMessages) {
    console.log(filename);

    errorMessages.forEach(message => {
        console.log("    " + message);
    });

    console.log("");
}



function initPhase(aggData) {
    nameExceptions = aggData.config.typeNameExceptions;

    let app = new Application({
        exclude: excludePatterns,
        ignoreCompilerErrors: true,
        experimentalDecorators: true,
        tsconfig: "tsconfig.json"
    });

    let sources = app.expandInputFiles(libFolders.map(folder => {
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

    let className = ngNameToClassName(path.basename(pathname, ".md"), nameExceptions);
    let classTypeMatch = className.match(/component|directive|service/i);
    let compData = aggData.classInfo[className];

    if (classTypeMatch && compData) {
        let classType = classTypeMatch[0].toLowerCase();

        // Copy docs back from the .md file when the JSDocs are empty.
        let inputMD = getPropDocsFromMD(tree, "Properties", 3);
        let outputMD = getPropDocsFromMD(tree, "Events", 2);
        updatePropDocsFromMD(compData, inputMD, outputMD, errorMessages);

        if (classType === "service") {
            let methodMD = getMethodDocsFromMD(tree);
            updateMethodDocsFromMD(compData, methodMD, errorMessages);
        }

        let templateName = path.resolve(templateFolder, classType + ".ejs");
        let templateSource = fs.readFileSync(templateName, "utf8");
        let template = ejs.compile(templateSource);

        let mdText = template(compData);
        mdText = mdText.replace(/^ +\|/mg, "|");

        let newSection = remark().parse(mdText.trim()).children;

        replaceSection(tree, "Class members", (before, section, after) => {
            newSection.unshift(before);
            newSection.push(after);
            return newSection;
        });

        compData.errors.forEach(err => {
            errorMessages.push(err);
        })
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
    let result = {}

    let nav = new MDNav(tree);

    let classMemHeading = nav
    .heading(h => {
        return (h.children[0].type === "text") && (h.children[0].value === "Class members");
    });

    let propsTable = classMemHeading
    .heading(h => {
        return (h.children[0].type === "text") && (h.children[0].value === sectionHeading);
    }).table();

    let propTableRow = propsTable.childNav
    .tableRow(()=>true, 1).childNav;

    let i = 1;

    while (!propTableRow.empty) {
        let propName = propTableRow
        .tableCell().childNav
        .text().item.value;

        let propDocText = propTableRow
        .tableCell(()=>true, docsColumn).childNav
        .text().item;

        if (propDocText) {
            result[propName] = propDocText.value;
        }

        i++;
        propTableRow = propsTable.childNav
        .tableRow(()=>true, i).childNav;
    }

    return result;
}


function getMethodDocsFromMD(tree) {
    let result = {}

    let nav = new MDNav(tree);

    let classMemHeading = nav
    .heading(h => {
        return (h.children[0].type === "text") && (h.children[0].value === "Class members");
    });

    let methListItems = classMemHeading
    .heading(h => {
        return (h.children[0].type === "text") && (h.children[0].value === "Methods");
    }).list().childNav;

    let methItem = methListItems
    .listItem();

    let i = 0;

    while (!methItem.empty) {
        let methNameSection = methItem.childNav
        .paragraph().childNav
        .strong().childNav;

        let methName = '';

        // Method docs must be in "new" format with names and types styled separately.
        if (!methNameSection.empty) {
            methName = methNameSection.text().item.value;

            let methDoc = methItem.childNav
            .paragraph().childNav
            .html()
            .text().value;

            let params = getMDMethodParams(methItem);

            result[methName] = {
                "docText": methDoc.replace(/^\n/, ""),
                "params": params
            };
        }

        i++;

        methItem = methListItems
        .listItem(l=>true, i);
    }
    /*
    let newRoot = unist.makeRoot([methList.item]);
    console.log(remark().use(frontMatter, {type: 'yaml', fence: '---'}).data("settings", {paddedTable: false, gfm: false}).stringify(tree));
    */

    return result;
}


function getMDMethodParams(methItem: MDNav) {
    let result = {};

    let paramList = methItem.childNav.list().childNav;

    let paramListItems = paramList
    .listItems();

    paramListItems.forEach(paramListItem => {
        let paramNameNode = paramListItem.childNav
        .paragraph().childNav
        .emph().childNav;

        let paramName;

        if (!paramNameNode.empty) {
            paramName = paramNameNode.text().item.value.replace(/:/, "");
        } else {
            paramName = paramListItem.childNav
            .paragraph().childNav
            .strong().childNav
            .text().item.value;
        }

        let paramDoc = paramListItem.childNav
        .paragraph().childNav
        .text(t=>true, 1).value; //item.value;

        result[paramName] = paramDoc.replace(/^[ -]+/, "");
    });

    return result;
}


function updatePropDocsFromMD(comp: ComponentInfo, inputDocs, outputDocs, errorMessages) {
    comp.properties.forEach(prop => {
        let propMDDoc: string;

        if (prop.isInput) {
            propMDDoc = inputDocs[prop.name];
        } else if (prop.isOutput) {
            propMDDoc = outputDocs[prop.name];
        }

        // If JSDocs are empty but MD docs aren't then the Markdown is presumably more up-to-date.
        if (!prop.docText && propMDDoc) {
            prop.docText = propMDDoc;
            errorMessages.push(`Warning: empty JSDocs for property "${prop.name}" may need sync with the .md file.`);
        }
    });
}


function updateMethodDocsFromMD(comp: ComponentInfo, methodDocs, errorMessages) {
    comp.methods.forEach(meth => {
        let currMethMD = methodDocs[meth.name]

        // If JSDocs are empty but MD docs aren't then the Markdown is presumably more up-to-date.
        if (!meth.docText && currMethMD && currMethMD.docText) {
            meth.docText = currMethMD.docText;
            errorMessages.push(`Warning: empty JSDocs for method sig "${meth.name}" may need sync with the .md file.`);
        }

        meth.params.forEach(param => {
            if (!param.docText && currMethMD && currMethMD.params[param.name])
            {
                param.docText = currMethMD.params[param.name];
                errorMessages.push(`Warning: empty JSDocs for parameter "${param.name} (${meth.name})" may need sync with the .md file.`);
            }
        });
    });
}
