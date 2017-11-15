var fs = require('fs');
var path = require('path');

var docFolderPath = path.resolve("..", "docs");
var graphFileName = path.resolve(docFolderPath, "seeAlsoGraph.json");


// Get a list of all items that have a file in the docs folder.
function getDocFolderItems(docFolderPath) {
    var result = {};
    var items = fs.readdirSync(path.resolve(docFolderPath));
    
    for (var i = 0; i < items.length; i++) {
        if (items[i].endsWith('.md')) {
            var nameNoSuffix = path.basename(items[i], '.md');
            result[nameNoSuffix] = 1;
        }
    }
    
    return result;
}


// Convert an Angular-style name (eg, "card-view") into one with correct spaces and uppercase (eg, "Card view").
function tidyName(name) {
    var result = name.replace(/-/g, " ");
    result = result.substr(0, 1).toUpperCase() + result.substr(1);
    return result;
}


function buildSeeAlsoList(arcs) {
    var listItems = [];
    
    for (var i = 0; i < arcs.length; i++) {
        var parts = arcs[i].split('.');
        var itemName = tidyName(parts[0]);
        
        if (parts[1]) {
            itemName += ' ' + parts[1];
        }
        
        listItems.push('- [' + itemName + '](' + arcs[i] + '.md)');
    }
    
    return listItems.join('\n');
}


// If item is not in the arcs array then add it at 
// the end.
function fixArcs(arcsArray, item) {
    if (arcsArray.indexOf(item) == -1) {
        arcsArray.push(item);
    }
}


// Makes link symmetrical between items (ie, if A links to B but not the other way
// around then it adds the missing link).
function tidyGraph(graph) {
    var nodeNames = Object.keys(graph);

    for (var n = 0; n < nodeNames.length; n++) {
        var currNodeName = nodeNames[n];
        
        var currNodeArcs = graph[currNodeName];
        
        for (var a = 0; a < currNodeArcs.length; a++) {
            var linkedNode = graph[currNodeArcs[a]];
            fixArcs(linkedNode, currNodeName);
        }
    }
}


var graphJson = fs.readFileSync(graphFileName, 'utf8');
var graph = JSON.parse(graphJson);
tidyGraph(graph);

var nodeNames = Object.keys(graph);

for (var i = 0; i < nodeNames.length; i++) {
    var seeAlsoText = '## See also\n\n' + buildSeeAlsoList(graph[nodeNames[i]]);
    
    var docFileName = path.resolve(docFolderPath, nodeNames[i] + '.md');
    var docFileText = fs.readFileSync(docFileName, 'utf8');
    
    var seeAlsoStartMarker = '<!-- seealso start -->';
    var seeAlsoEndMarker = '<!-- seealso end -->';
    
    var seeAlsoRegex = new RegExp('(?:' + seeAlsoStartMarker + ')([\\s\\S]*)(?:' + seeAlsoEndMarker + ')');
    docFileText = docFileText.replace(seeAlsoRegex, seeAlsoStartMarker + '\n' + seeAlsoText + '\n' + seeAlsoEndMarker);
    
    fs.writeFileSync(docFileName, docFileText, 'utf-8');
}