var path = require("path");

var unist = require("../unistHelpers");

var seeAlsoHeading = "See Also";

module.exports = {
    "initPhase": initPhase,
    "readPhase": readPhase,
    "aggPhase": aggPhase,
    "updatePhase": updatePhase
}


function initPhase(aggData) {
    aggData.saGraph = {};
    aggData.saUpdateGraph = {};
}


function readPhase(tree, pathname, aggData) {
    var saHeadingOffset = findSeeAlsoSection(tree);

    var saNode = [];

    if (saHeadingOffset !== -1) {
        // Skip over non-list parts.
        var s;

        for (
            s = saHeadingOffset;
            (s < tree.children.length) && !unist.isListUnordered(tree.children[s]);
            s++
        );

        if ((s < tree.children.length) && unist.isListUnordered(tree.children[s])) {
            var list = tree.children[s];

            for (var i = 0; i < list.children.length; i++) {
                var itemLink = getItemLinkInfo(list.children[i]);

                if (itemLink) {
                    saNode.push(itemLink);
                }
            }
        }
    }

    aggData.saGraph[path.basename(pathname, ".md")] = saNode;
}


function aggPhase(aggData) {
    aggData.saUpdateGraph = tidyGraph(aggData.saGraph);
}


function updatePhase(tree, pathname, aggData) {
    var currNodeName = path.basename(pathname, ".md");
    var currNodeArcs = aggData.saUpdateGraph[currNodeName];

    if (currNodeArcs.length > 0) {
        var saListItems = [];

        for (var i = 0; i < currNodeArcs.length; i++) {
            var linkText = graphKeyToLinkName(currNodeArcs[i]);
            var linkTarget = currNodeArcs[i] + ".md";
            var link = unist.makeLink(unist.makeText(linkText), linkTarget);
            saListItems.push(unist.makeListItem(link));
        }

        var saHeadingOffset = findSeeAlsoSection(tree);

        if (saHeadingOffset !== -1) {
            // Skip over non-list parts.
            var s;

            for (
                s = saHeadingOffset;
                (s < tree.children.length) && !unist.isListUnordered(tree.children[s]);
                s++
            );

            // Push all elements of the items array as if they were separate elements.
            Array.prototype.push.apply(tree.children[s].children, saListItems);
        } else {
            // This file doesn't currently have a See Also section, so add one at the end.
            tree.children.push(unist.makeHeading(unist.makeText(seeAlsoHeading), 2));
            tree.children.push(unist.makeListUnordered(saListItems));
        }
    }

    return true;
}


function graphKeyToLinkName(key) {
    var mainSections = key.split(".");
    mainSections[0] =  tidyName(mainSections[0]);
    return mainSections.join(" ");
}

// Convert an Angular-style name (eg, "card-view") into one with correct spaces and uppercase (eg, "Card view").
function tidyName(name) {
    var result = name.replace(/-/g, " ");
    result = result.substr(0, 1).toUpperCase() + result.substr(1);
    return result;
}


function makeEmptySAList() {
    var result = [];


}


// Makes link symmetrical between items (ie, if A links to B but not the other way
// around then it adds the missing link).
function tidyGraph(graph) {
    var nodeNames = Object.keys(graph);
    var result = {};

    for (var n = 0; n < nodeNames.length; n++) {
        result[nodeNames[n]] = [];
    }

    for (var n = 0; n < nodeNames.length; n++) {
        var currNodeName = nodeNames[n];

        var currNodeArcs = graph[currNodeName];

        for (var a = 0; a < currNodeArcs.length; a++) {
            var linkedNode = graph[currNodeArcs[a]];
            var resultNode = result[currNodeArcs[a]];

            if (!linkedNode) {
                console.log(`Warning: item '${currNodeArcs[a]}' (in See Also section of '${currNodeName}') has no corresponding file`);
            } else if (linkedNode.indexOf(currNodeName) === -1) {
                linkedNode.push(currNodeName);
                resultNode.push(currNodeName);
            }
        }
    }

    return result;
}


function findSeeAlsoSection(tree) {
    var i;

    for (i = 0; i < tree.children.length; i++) {
        var child = tree.children[i];

        if (unist.isHeading(child) && (child.children[0].value.toLowerCase() === seeAlsoHeading.toLowerCase()))
            return i;
    }

    return -1;
}


function getItemLinkInfo(listItem) {
    var linkTarget = listItem.children[0].children[0].url;

    if (linkTarget.startsWith("http:") ||
        linkTarget.startsWith("#") ||
        !linkTarget.endsWith(".md"))
        return null;
    else
        return path.basename(linkTarget, ".md");
}

