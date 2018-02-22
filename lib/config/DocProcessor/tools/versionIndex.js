var fs = require("fs");
var path = require("path");
var yaml = require("js-yaml");

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

var docsFolderPath = path.resolve("..", "docs");
var histFilePath = path.resolve(docsFolderPath, "versionIndex.md");

var histSectionName = "history";
var initialVersion = "v2.0.0";

function initPhase(aggData) {
    aggData.versions = { "v2.0.0":[] };
}


function readPhase(tree, pathname, aggData) {
    var compName = path.basename(pathname, ".md");
    var angNameRegex = /([a-zA-Z0-9\-]+)\.((component)|(directive)|(model)|(pipe)|(service)|(widget))/;

    if (!compName.match(angNameRegex))
        return;
    
    if (compName.match(/boilerplate/))
        return;
        
    if (tree.children[0].type == "yaml") {
        var metadata = yaml.load(tree.children[0].value);
        var version = metadata["Added"];

        if (version) {
            if (aggData.versions[version]) {
                aggData.versions[version].push(compName);
            } else {
                aggData.versions[version] = [compName];
            }
        } else {
            aggData.versions[initialVersion].push(compName);
        }
    } else {
        aggData.versions[initialVersion].push(compName);
    }
}

function aggPhase(aggData) {
    var histFileText = fs.readFileSync(histFilePath, "utf8");
    var histFileTree = remark().parse(histFileText);

    var keys = Object.keys(aggData.versions);
    keys.sort((a, b) => {
        if (a > b) 
            return -1;
        else if (b > a)
            return 1;
        else
            return 0;
    });

    var sections = [unist.makeHeading(unist.makeText("Versions"), 2)];

    var vListItems = [];

    for (var i = 0; i < keys.length; i++) {
        vListItems.push(unist.makeListItem(unist.makeLink(unist.makeText(keys[i]), `#${keys[i]}`)));
    }

    sections.push(unist.makeListUnordered(vListItems));

    for (var i = 0; i < keys.length; i++) {
        var version = keys[i];
        var versionItems = aggData.versions[version];
        versionItems.sort();

        var versListItems = [];

        for (var v = 0; v < versionItems.length; v++) {
            var displayName = ngHelpers.ngNameToDisplayName(versionItems[v]);
            var pageLink = versionItems[v] + ".md";

            versListItems.push(
                unist.makeListItem(
                    unist.makeLink(unist.makeText(displayName), pageLink)
                )
            );
        }

        sections.push(unist.makeHeading(unist.makeText(version), 2));
        sections.push(unist.makeListUnordered(versListItems));
    }

    zone(histFileTree, histSectionName, (startComment, oldSection, endComment) => {
        sections.unshift(startComment);
        sections.push(endComment);
        return sections;
    });

    //console.log(JSON.stringify(histFileTree));
    fs.writeFileSync(histFilePath, remark().stringify(histFileTree));
}


function updatePhase(tree, pathname, aggData) {
    return false;
}