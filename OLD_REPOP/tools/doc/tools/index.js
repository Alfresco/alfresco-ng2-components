var fs = require("fs");
var path = require("path");

var remark = require("remark");
var frontMatter = require("remark-frontmatter");
var zone = require("mdast-zone");
var yaml = require("js-yaml");

var unist = require("../unistHelpers");
var ngHelpers = require("../ngHelpers");
var searchLibraryRecursive = require("../libsearch");
var mdNav = require("../mdNav");

module.exports = {
    "processDocs": processDocs
};

var docsFolderPath = path.resolve("docs");
var rootFolder = "lib";
var indexMdFilePath = path.resolve(docsFolderPath, "README.md");

var guideFolderName = "user-guide";
var guideSummaryFileName = path.resolve(docsFolderPath, guideFolderName, "summary.json");

var adfLibNames = [
    "core", "content-services", "insights",
    "process-services", "process-services-cloud", "extensions"
];

var statusIcons;

function processDocs(mdCache, aggData) {
    initPhase(aggData);
    readPhase(mdCache, aggData);
    aggPhase(aggData);
}

function initPhase(aggData) {
    statusIcons = aggData.config["statusIcons"] || {};
    aggData.stoplist = makeStoplist(aggData.config);
    aggData.srcData = {};
    aggData.mdFileDesc = [];
    aggData.mdFileStatus = [];
    aggData.mdFilePath = [];
    searchLibraryRecursive(aggData.srcData, path.resolve(rootFolder));
}

function readPhase(mdCache, aggData) {
    var pathnames = Object.keys(mdCache);

    pathnames.forEach(pathname => {
        getFileData(mdCache[pathname].mdInTree, pathname, aggData);
    });
}

function getFileData(tree, pathname, aggData) {
    var itemName = path.basename(pathname, ".md");

    // Look for the first paragraph in the file by skipping other items.
    // Should usually be at position 1 in the tree.
    var s;
    var briefDesc;

    if (tree.children[0].type == "yaml")
        s = 1;
    else
        s = 0;

    for (;
        (s < tree.children.length) && !unist.isParagraph(tree.children[s]);
        s++
    );

    if (s < tree.children.length) {
        briefDesc = tree.children[s];
    }

    aggData.mdFileDesc[itemName] = briefDesc;

    if (tree.children[0].type == "yaml") {
        var metadata = yaml.load(tree.children[0].value);
        var status = metadata["Status"];

        if (status) {
            var compName = path.basename(pathname, ".md");
            aggData.mdFileStatus[compName] = status;
        }

    }

    var linkPath = pathname.replace(/\\/g, '/');
    linkPath = linkPath.substr(linkPath.indexOf("docs") + 5);
    aggData.mdFilePath[itemName] = linkPath;
}

function aggPhase(aggData) {
    var sections = prepareIndexSections(aggData);

    var indexFileText = fs.readFileSync(indexMdFilePath, "utf8");
    var indexFileTree = remark().use(frontMatter, ["yaml"]).parse(indexFileText);

    for (var l = 0; l < adfLibNames.length; l++) {

        var libName = adfLibNames[l];
        var libSection = sections[libName];

        var md = makeLibSectionMD(libSection, false);

        zone(indexFileTree, libName, (startComment, oldSection, endComment) => {
            md.unshift(startComment);
            md.push(endComment);
            return md;
        });

        var md = makeLibSectionMD(libSection, true);

        var subIndexFilePath = path.resolve(docsFolderPath, libName, "README.md");
        var subIndexText = fs.readFileSync(subIndexFilePath, "utf8");
        var subIndexTree = remark().use(frontMatter, ["yaml"]).parse(subIndexText);

        zone(subIndexTree, libName, (startComment, oldSection, endComment) => {
            md.unshift(startComment);
            md.push(endComment);
            return md;
        });

        subIndexText = remark().use(frontMatter, ["yaml"]).data("settings", {paddedTable: false}).stringify(subIndexTree);
        fs.writeFileSync(subIndexFilePath, subIndexText);
    }

    var guideSection = buildGuideSection(guideSummaryFileName, false);

    zone(indexFileTree, "guide", (startComment, oldSection, endComment) => {
        return [
            startComment, guideSection, endComment
        ]
    });

    fs.writeFileSync(path.resolve("docs", "README.md"), remark().use(frontMatter, ["yaml"]).data("settings", {paddedTable: false}).stringify(indexFileTree));

    guideSection = buildGuideSection(guideSummaryFileName, true);

    subIndexFilePath = path.resolve(docsFolderPath, "user-guide", "README.md");
    subIndexText = fs.readFileSync(subIndexFilePath, "utf8");
    subIndexTree = remark().use(frontMatter, ["yaml"]).parse(subIndexText);

    zone(subIndexTree, "guide", (startComment, oldSection, endComment) => {
        return [
            startComment, guideSection, endComment
        ]
    });

    subIndexText = remark().use(frontMatter, ["yaml"]).data("settings", {paddedTable: false}).stringify(subIndexTree);
    fs.writeFileSync(subIndexFilePath, subIndexText);
}


// Create a stoplist of regular expressions.
function makeStoplist(config) {
    var listExpressions = config.undocStoplist;
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

function prepareIndexSections(aggData) {
    var srcNames = Object.keys(aggData.srcData);
    var sections = initEmptySections();

    for (var i = 0; i < srcNames.length; i++) {
        var itemName = srcNames[i];
        var srcData = aggData.srcData[itemName];
        var libName = srcData.path.substr(0, srcData.path.indexOf("/"));

        var briefDesc = aggData.mdFileDesc[itemName];

        var displayName = ngHelpers.ngNameToDisplayName(itemName);
        var pathname = aggData.mdFilePath[itemName];

        var status = "";

        if (aggData.mdFileStatus[itemName])
            status = aggData.mdFileStatus[itemName];

        if (briefDesc) {
            sections[libName][srcData.type].documented.push({
                "displayName": displayName,
                "mdName": itemName + ".md",
                "mdPath": pathname,
                "srcPath": srcData.path,
                "briefDesc": briefDesc,
                "status": status
            });
        } else if (!rejectItemViaStoplist(aggData.stoplist, itemName)) {
            if(sections[libName]){
            sections[libName][srcData.type].undocumented.push({
                "displayName": displayName,
                "mdName": itemName + ".md",
                "srcPath": srcData.path
            });
            }
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


function buildMDDocumentedTable(docItems, forSubFolder) {
    var rows = [

    ];

    for (var i = 0; i < docItems.length; i++) {
        rows.push(makeMDDocumentedTableRow(docItems[i], forSubFolder));
    }

    return rows;
}


function buildMDUndocumentedTable(docItems, forSubFolder) {
    var rows = [

    ];

    for (var i = 0; i < docItems.length; i++) {
        rows.push(makeMDUndocumentedTableRow(docItems[i], forSubFolder));
    }

    return rows;
}


function makeMDDocumentedTableRow(docItem, forSubFolder) {
    var mdPath = docItem.mdPath;

    if (forSubFolder) {
        mdPath = path.basename(mdPath);
    }

    var mdFileLink = unist.makeLink(unist.makeText(docItem.displayName), mdPath);

    var srcPath = "../lib/" + docItem.srcPath;

    if (forSubFolder) {
        srcPath = "../" + srcPath;
    }

    var srcFileLink = unist.makeLink(unist.makeText("Source"), srcPath);
    var desc = JSON.parse(JSON.stringify(docItem.briefDesc));

    removeBriefDescLinks(desc);

    var linkCellItems = [mdFileLink];

    var pathPrefix = "";


    if (forSubFolder) {
        pathPrefix = "../";
    }

    if (docItem.status) {

        if (statusIcons[docItem.status]) {
            linkCellItems.push(unist.makeText(" "));
            linkCellItems.push(unist.makeImage(pathPrefix + statusIcons[docItem.status], docItem.status));
        }
    }

    return unist.makeTableRow([
        unist.makeTableCell(linkCellItems),
        unist.makeTableCell([desc]),
        unist.makeTableCell([srcFileLink])
    ]);
}


function makeMDUndocumentedTableRow(docItem, forSubFolder) {
    var itemName = unist.makeText(docItem.displayName);
    var srcPath = "../lib/" + docItem.srcPath;

    if (forSubFolder) {
        srcPath = "../" + srcPath;
    }

    var srcFileLink = unist.makeLink(unist.makeText("Source"), srcPath);

    return unist.makeTableRow([
        unist.makeTableCell([unist.makeEmphasis([itemName])]),
        unist.makeTableCell([unist.makeEmphasis([unist.makeText("Not currently documented")])]),
        unist.makeTableCell([srcFileLink])
    ]);
}


function makeLibSectionMD(libSection, forSubFolder){
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
                tableRows = tableRows.concat(buildMDDocumentedTable(classSection.documented, forSubFolder));
            }

            if (classSection.undocumented.length > 0) {
                tableRows = tableRows.concat(buildMDUndocumentedTable(classSection.undocumented, forSubFolder));
            }

            md.push(unist.makeTable([null, null, null, null], tableRows));
        }
    }

    return md;
}


function buildGuideSection(guideJsonFilename, forSubFolder) {
    var summary = JSON.parse(fs.readFileSync(guideJsonFilename, "utf8"));

    var listItems = [];

    for (var i = 0; i < summary.length; i++) {
        var filePath = summary[i].file;

        if (!forSubFolder) {
            filePath = guideFolderName + "/" + filePath;
        }

        if (summary[i].title !== "Tutorials") {
            var link = unist.makeLink(unist.makeText(summary[i].title), filePath);
            listItems.push(unist.makeListItem(link));
        }
    }

    return unist.makeListUnordered(listItems);
}


function removeBriefDescLinks(desc) {
    var nav = new mdNav.MDNav(desc);

    var links = nav.links();

    links.forEach(link => {
        link.item.type = "text";
        link.item.value = link.item.children[0].value;
        link.item.children = null;
    });
}
