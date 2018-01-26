var fs = require("fs");
var path = require("path");

var remark = require("remark");
var stringify = require("remark-stringify");
var zone = require("mdast-zone");

var unist = require("../unistHelpers");
var ngHelpers = require("../ngHelpers");


module.exports = {
    "initPhase": initPhase,
    "readPhase": readPhase,
    "aggPhase": aggPhase,
    "updatePhase": updatePhase
}

var angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(directive)|(model)|(pipe)|(service)|(widget))\.ts/;
var searchFolderOmitRegex = /(config)|(mock)|(i18n)|(assets)|(styles)/;

var docsFolderPath = path.resolve("..", "docs");
var undocStoplistFileName = path.resolve(docsFolderPath, "undocStoplist.json");
var rootFolder = ".";
var indexMdFilePath = path.resolve(docsFolderPath, "README.md");
var guideSummaryFileName = path.resolve(docsFolderPath, "summary.json");

var maxBriefDescLength = 180;

var adfLibNames = ["core", "content-services", "insights", "process-services"];


function initPhase(aggData) {
    aggData.stoplist = makeStoplist(undocStoplistFileName);    
    aggData.srcData = {};
    aggData.mdFileDesc = [];

    searchLibraryRecursive(aggData.srcData, path.resolve(rootFolder));

    //console.log(JSON.stringify(aggData.srcData));
}


function readPhase(tree, pathname, aggData) {
    var itemName = path.basename(pathname, ".md");

    // Look for the first paragraph in the file by skipping other items.
    // Should usually be a position 1 in the tree.
    var s;
    var briefDesc;

    for (
        s = 0;
        (s < tree.children.length) && !unist.isParagraph(tree.children[s]);
        s++
    );

    if (s < tree.children.length) {
        briefDesc = tree.children[s];
    }

    aggData.mdFileDesc[itemName] = briefDesc;
}

function aggPhase(aggData) {
    var sections = prepareIndexSections(aggData);
    //console.log(JSON.stringify(sections));

    var indexFileText = fs.readFileSync(indexMdFilePath, "utf8");
    var indexFileTree = remark().parse(indexFileText);

    for (var l = 0; l < adfLibNames.length; l++) {

        var libName = adfLibNames[l];
        var libSection = sections[libName];
        
        var md = makeLibSectionMD(libSection);

        zone(indexFileTree, libName, (startComment, oldSection, endComment) => {
            md.unshift(startComment);
            md.push(endComment);
            return md;
        });
    }

    var guideSection = buildGuideSection(guideSummaryFileName);

    zone(indexFileTree, "guide", (startComment, oldSection, endComment) => {
        return [
            startComment, guideSection, endComment
        ]
    });

    fs.writeFileSync(path.resolve("..", "docs", "README.md"), remark().data("settings", {paddedTable: false}).stringify(indexFileTree));
    //fs.writeFileSync(indexMdFilePath, remark().stringify(indexFileTree));
    //fs.writeFileSync(path.resolve(".", "testJson.md"), JSON.stringify(indexFileTree));
}


function updatePhase(tree, pathname, aggData) {
    return false;
}


// Create a stoplist of regular expressions.
function makeStoplist(slFilePath) {
    var listExpressions = JSON.parse(fs.readFileSync(slFilePath, 'utf8'));
    
    var result = [];
    
    for (var i = 0; i < listExpressions.length; i++) {
        result.push(new RegExp(listExpressions[i]));
    }
    
    return result;
}

// Check if an item is covered by the stoplist and reject it if so.
function rejectItemViaStoplist(stoplist, itemName) {
    for (var i = 0; i < stoplist.length; i++) {
        if (stoplist[i].test(itemName)) {
            return true;
        }
    }
    
    return false;
}


//  Search source folders for .ts files to discover all components, directives, etc.
function searchLibraryRecursive(srcData, folderPath) {
    var items = fs.readdirSync(folderPath);
    
    for (var i = 0; i < items.length; i++) {
        var itemPath = path.resolve(folderPath, items[i]);
        var info = fs.statSync(itemPath);
        
        if (info.isFile() && (items[i].match(angFilenameRegex))) {
            var nameNoSuffix = path.basename(items[i], '.ts');
            
            var displayPath = itemPath.replace(/\\/g, '/');
            displayPath = displayPath.substr(displayPath.indexOf("lib") + 4);

            // Type == "component", "directive", etc.
            var itemType = nameNoSuffix.split('.')[1];
            
            srcData[nameNoSuffix] = { "path": displayPath, "type": itemType };            
        } else if (info.isDirectory() && !items[i].match(searchFolderOmitRegex)) {
            searchLibraryRecursive(srcData, itemPath);
        }
    }
}


function prepareIndexSections(aggData) {
    var srcNames = Object.keys(aggData.srcData);
    var sections = initEmptySections();

    for (var i = 0; i < srcNames.length; i++) {
        var itemName = srcNames[i];
        var srcData = aggData.srcData[itemName];
        var libName = srcData.path.substr(0, srcData.path.indexOf("/"));

        var briefDesc = aggData.mdFileDesc[itemName];

        var displayName = ngHelpers.ngNameToDisplayName(itemName);

        if (briefDesc) {
            sections[libName][srcData.type].documented.push({
                "displayName": displayName,
                "mdName": itemName + ".md",
                "srcPath": srcData.path,
                "briefDesc": briefDesc
            });
        } else if (!rejectItemViaStoplist(aggData.stoplist, itemName)) {
            sections[libName][srcData.type].undocumented.push({
                "displayName": displayName,
                "mdName": itemName + ".md",
                "srcPath": srcData.path
            });
        }
    }

    return sections;
}


function initEmptySections() {
    var result = {};

    for (var l = 0; l < adfLibNames.length; l++) {
        var lib = result[adfLibNames[l]] = {};

        for (var c = 0; c < ngHelpers.classTypes.length; c++) {
            var classType = lib[ngHelpers.classTypes[c]] = {};

            classType.undocumented = [];
            classType.documented = [];
        }
    }

    return result;
}


function buildMDDocumentedSection(docItems) {
    var listItems = [];

    for (var i = 0; i < docItems.length; i++) {
        listItems.push(makeMDDocumentedListItem(docItems[i]));
    }

    return unist.makeListUnordered(listItems);
}


function buildMDUndocumentedSection(docItems) {
    var listItems = [];

    for (var i = 0; i < docItems.length; i++) {
        listItems.push(makeMDUndocumentedListItem(docItems[i]));
    }

    return unist.makeListUnordered(listItems);
}


function buildMDDocumentedTable(docItems) {
    var rows = [
        
    ];
    
    for (var i = 0; i < docItems.length; i++) {
        rows.push(makeMDDocumentedTableRow(docItems[i]));
    }

    return rows;
    //return unist.makeTable([null, null, null, null], rows);
}


function buildMDUndocumentedTable(docItems) {
    var rows = [
       
    ];
    
    for (var i = 0; i < docItems.length; i++) {
        rows.push(makeMDUndocumentedTableRow(docItems[i]));
    }

    return rows;
    //return unist.makeTable([null, null, null, null], rows);
}


function makeMDDocumentedListItem(docItem) {
    var mdFileLink = unist.makeLink(unist.makeText(docItem.displayName), docItem.mdName);
    var srcFileLink = unist.makeLink(unist.makeText("Source"), "../lib/" + docItem.srcPath);
    var desc = docItem.briefDesc;

    var para = unist.makeParagraph([
        mdFileLink, unist.makeText(" ("), srcFileLink, unist.makeText(") "), desc 
    ]);

    return unist.makeListItem(para);
}


function makeMDUndocumentedListItem(docItem) {
    var itemName = unist.makeText(docItem.displayName);
    var srcFileLink = unist.makeLink(unist.makeText("Source"), "../lib/" + docItem.srcPath);

    var para = unist.makeParagraph([
       unist.makeText("* "), itemName, unist.makeText(" ("), srcFileLink, unist.makeText(")") 
    ]);

    return unist.makeListItem(para);
}


function makeMDDocumentedTableRow(docItem) {
    var mdFileLink = unist.makeLink(unist.makeText(docItem.displayName), docItem.mdName);
    var srcFileLink = unist.makeLink(unist.makeText("Source"), "../lib/" + docItem.srcPath);
    var desc = docItem.briefDesc;

    return unist.makeTableRow([
        unist.makeTableCell([mdFileLink]),
        unist.makeTableCell([desc]),
        unist.makeTableCell([srcFileLink])
    ]);
}


function makeMDUndocumentedTableRow(docItem) {
    var itemName = unist.makeText(docItem.displayName);
    var srcFileLink = unist.makeLink(unist.makeText("Source"), "../lib/" + docItem.srcPath);

    return unist.makeTableRow([
        unist.makeTableCell([unist.makeEmphasis([itemName])]),
        unist.makeTableCell([unist.makeEmphasis([unist.makeText("Not currently documented")])]),
        unist.makeTableCell([srcFileLink])
    ]);
}


function makeLibSectionMD(libSection){
    var md = [];

    var libClassTypes = Object.keys(libSection);
    
    for (var i = 0; i < libClassTypes.length; i++) {
        var classType = libClassTypes[i];

        var classSection = libSection[classType];

        if (!classSection)
            continue;

        var displayNameNode;

        if ((classSection.documented.length > 0) || (classSection.undocumented.length > 0)) {
            displayNameNode = unist.makeText(ngHelpers.dekebabifyName(classType + "s"));
            md.push(unist.makeHeading(displayNameNode, 2));
        
            var tableRows = [
                unist.makeTableRow([
                    unist.makeTableCell([unist.makeText("Name")]),
                    unist.makeTableCell([unist.makeText("Description")]),
                    unist.makeTableCell([unist.makeText("Source link")])
                ])
            ];

            if (classSection.documented.length > 0) {
                //md.push(buildMDDocumentedSection(classSection.documented));
                tableRows = tableRows.concat(buildMDDocumentedTable(classSection.documented));
            }

            if (classSection.undocumented.length > 0) {
                // md.push(buildMDUndocumentedSection(classSection.undocumented));
                tableRows = tableRows.concat(buildMDUndocumentedTable(classSection.undocumented));
            }

            md.push(unist.makeTable([null, null, null, null], tableRows));
        }
    }

    return md;
}


function buildGuideSection(guideJsonFilename) {
    var summary = JSON.parse(fs.readFileSync(guideJsonFilename, "utf8"));

    var listItems = [];

    for (var i = 0; i < summary.length; i++) {
        var link = unist.makeLink(unist.makeText(summary[i].title), summary[i].file);
        listItems.push(unist.makeListItem(link));
    }

    return unist.makeListUnordered(listItems);
}