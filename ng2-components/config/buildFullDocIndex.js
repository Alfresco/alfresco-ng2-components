var fs = require('fs');
var path = require('path');

var angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(directive)|(model)|(service)|(widget))\.ts/;

var indexFileName = path.resolve('..', 'docIndex.md');
var summaryFileName = path.resolve('..', 'docs', 'summary.json');
var undocStoplistFileName = path.resolve('..', 'docs', 'undocStoplist.json');


//  Search source folders for .ts files to discover all components, directives, etc,
//  that are in the supplied library.
function searchLibraryRecursive(libData, folderPath) {
    var items = fs.readdirSync(folderPath);
    
    for (var i = 0; i < items.length; i++) {
        var itemPath = path.resolve(folderPath, items[i]);
        var info = fs.statSync(itemPath);
        
        if (info.isFile() && (items[i].match(angFilenameRegex))) {
            var nameNoSuffix = path.basename(items[i], '.ts');
            
            var itemCategory = nameNoSuffix.split('.')[1];
            
            if(nameNoSuffix in docDict) {
                switch (itemCategory) {
                    case "component":
                        libData.componentsWithDocs.push(itemPath);
                        break;
                    
                    case "directive":
                        libData.directivesWithDocs.push(itemPath);
                        break;
                    
                    case "model":
                        libData.modelsWithDocs.push(itemPath);
                        break;
                        
                    case "service":
                        libData.servicesWithDocs.push(itemPath);
                        break;
                    
                    case "widget":
                        libData.widgetsWithDocs.push(itemPath);
                        break;
                    
                    default:
                        break;
                }
            } else if (!rejectItemViaStoplist(undocStoplist, items[i])) {
                switch (itemCategory) {
                    case "component":
                        libData.componentsWithoutDocs.push(itemPath);
                        break;
                    
                    case "directive":
                        libData.directivesWithoutDocs.push(itemPath);
                        break;
                    
                    case "model":
                        libData.modelsWithoutDocs.push(itemPath);
                        break;
                        
                    case "service":
                        libData.servicesWithoutDocs.push(itemPath);
                        break;
                    
                    case "widget":
                        libData.widgetsWithoutDocs.push(itemPath);
                        break;
                    
                    default:
                        break;
                }
            }
        } else if (info.isDirectory()) {
            searchLibraryRecursive(libData, itemPath);
        }
    }
}


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

// Convert an Angular-style name (eg, "card-view") into one with correct spaces and uppercase (eg, "Card View").
function tidyName(name) {
    var result = name.replace(/-/g, " ");
    result = result.substr(0, 1).toUpperCase() + result.substr(1);
    return result;
}


// Generate the Markdown index for the files from the guide summary.
function makeSummaryIndex() {
    var summaryJson = fs.readFileSync(summaryFileName, 'utf8');
    var summary = JSON.parse(summaryJson);
        
    var result = '';
    
    for (var i = 0; i < summary.length; i++) {
        var item = summary[i];
        result += '- [' + item.title + '](docs/' + item.file + ')\n';
    }
    
    return result;
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


function buildIndexSection(name, documented, undocumented) {
    var listItems = [];
    
    if ((documented.length > 0) || (undocumented.length > 0)) {
        listItems.push('\n### ' + name + '\n');
    }
    
    for (var i = 0; i < documented.length; i++) {
        var libFilePath = documented[i];
        var libFileName = path.basename(libFilePath, '.ts');
        var nameSections = libFileName.split('.');
        var visibleName = tidyName(nameSections[0]) + ' ' + nameSections[1];
        var mdListItem = '- [' + visibleName + '](docs/' + libFileName + '.md)';
        listItems.push(mdListItem);
    }
    
    for (var i = 0; i < undocumented.length; i++) {
        var libFilePath = undocumented[i].replace(/\\/g, '/');
        var libFileName = path.basename(libFilePath, '.ts');
        var nameSections = libFileName.split('.');
        var visibleName = tidyName(nameSections[0]) + ' ' + nameSections[1];
        var relPath = libFilePath.substr(libFilePath.indexOf('/ng2-') + 1);
        var mdListItem = '- [*' + visibleName + '](' + relPath + ')';
        listItems.push(mdListItem);
    }
    
    return listItems;
}


var undocStoplist = makeStoplist(undocStoplistFileName);

var docDict = getDocFolderItems(path.resolve('..', 'docs'));

var rootItems = fs.readdirSync(path.resolve('.'));

var libs = {}

for (var i = 0; i < rootItems.length; i++) {
    var itemPath = path.resolve(rootItems[i]);
    var info = fs.statSync(itemPath);
    
    if (info.isDirectory() && rootItems[i].match(/ng2-/)) {
        libs[rootItems[i]] = {
            componentsWithDocs: [], componentsWithoutDocs: [],
            directivesWithDocs: [], directivesWithoutDocs: [],
            modelsWithDocs: [],     modelsWithoutDocs: [],
            servicesWithDocs: [],   servicesWithoutDocs: [],
            widgetsWithDocs: [],    widgetsWithoutDocs: [],
        };
        
        //var itemsWithDocs = libs[rootItems[i]].componentsWithDocs;
        //var itemsWithoutDocs = libs[rootItems[i]].componentsWithoutDocs;

        searchLibraryRecursive(libs[rootItems[i]], path.resolve(itemPath, 'src'));
    }
}

var indexFileText = fs.readFileSync(indexFileName, 'utf8');

var libNames = Object.keys(libs);

for (var i = 0; i < libNames.length; i++) {
    var libName = libNames[i];
    var libData = libs[libName];
    
    var listItems = buildIndexSection('Components', libData.componentsWithDocs, libData.componentsWithoutDocs);
    listItems = listItems.concat(buildIndexSection('Directives', libData.directivesWithDocs, libData.directivesWithoutDocs));
    listItems = listItems.concat(buildIndexSection('Models', libData.modelsWithDocs, libData.modelsWithoutDocs));
    listItems = listItems.concat(buildIndexSection('Services', libData.servicesWithDocs, libData.servicesWithoutDocs));
    listItems = listItems.concat(buildIndexSection('Widgets', libData.widgetsWithDocs, libData.widgetsWithoutDocs));
    
    var libText = listItems.join('\n');
    var libStartMarker = '<!-- ' + libName + ' start -->';
    var libEndMarker = '<!-- ' + libName + ' end -->';
    var contentRegex = new RegExp('(?:' + libStartMarker + ')([\\s\\S]*)(?:' + libEndMarker + ')');
    indexFileText = indexFileText.replace(contentRegex, libStartMarker + '\n' + libText + '\n' + libEndMarker);
}

var guideStartMarker = '<!-- guide start -->';
var guideEndMarker = '<!-- guide end -->';
var contentRegex = new RegExp('(?:' + guideStartMarker + ')([\\s\\S]*)(?:' + guideEndMarker + ')');
indexFileText = indexFileText.replace(contentRegex, guideStartMarker + '\n' + makeSummaryIndex() + '\n' + guideEndMarker);
    
fs.writeFileSync(indexFileName, indexFileText, 'utf-8');
