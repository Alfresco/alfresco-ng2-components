var fs = require('fs');
var path = require('path');

var angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(directive)|(model)|(service)|(widget))\.ts/;

var indexFileName = '../docIndex.md';
var summaryFileName = path.resolve('..', 'docs', 'summary.json');


function searchFolderRecursive(folderPath) {
    var items = fs.readdirSync(path.resolve(folderPath));
    
    for (var i = 0; i < items.length; i++) {
        var itemPath = path.resolve(folderPath, items[i]);
        var info = fs.statSync(itemPath);
        
        if (info.isFile() && (items[i].match(angFilenameRegex))) {
            var nameNoSuffix = path.basename(items[i], '.ts');//items[i].substring(0, items[i].length - 4);
            
            if(nameNoSuffix in docDict) {
                itemsWithDocs.push(itemPath);
            } else {
                itemsWithoutDocs.push(itemPath);
            }
        } else if (info.isDirectory()) {
            searchFolderRecursive(itemPath);
        }
    }
}

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

function tidyName(name) {
    var result = name.replace(/-/g, " ");
    result = result.substr(0, 1).toUpperCase() + result.substr(1);
    return result;
}

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


var docDict = getDocFolderItems(path.resolve('..', 'docs'));

var rootItems = fs.readdirSync(path.resolve('.'));

var libs = {}

for (var i = 0; i < rootItems.length; i++) {
    var itemPath = path.resolve(rootItems[i]);
    var info = fs.statSync(itemPath);
    
    if (info.isDirectory() && rootItems[i].match(/ng2-/)) {
        libs[rootItems[i]] =[ [], [] ];
        var itemsWithDocs = libs[rootItems[i]][0];
        var itemsWithoutDocs = libs[rootItems[i]][1];
        searchFolderRecursive(path.resolve(itemPath, 'src'));
    }
}



var indexFileText = fs.readFileSync(indexFileName, 'utf8');

var libNames = Object.keys(libs);

for (var i = 0; i < libNames.length; i++) {
    var listItems = [];
    var libName = libNames[i];
    var libData = libs[libName];
    
    if (libData[0].length > 0) {
        listItems.push('**Documented**\n');
        
        for (var j = 0; j < libData[0].length; j++) {
            var libFilePath = libData[0][j];
            var libFileName = path.basename(libFilePath, '.ts');
            var nameSections = libFileName.split('.');
            var visibleName = tidyName(nameSections[0]) + ' ' + nameSections[1];
            var mdListItem = '- [' + visibleName + '](docs/' + libFileName + '.md)';
            listItems.push(mdListItem);
        }
    }
    
    if (libData[1].length > 0) {
        listItems.push('\n**Undocumented**\n');
            
        for (var j = 0; j < libData[1].length; j++) {
            var libFilePath = libData[1][j].replace(/\\/g, '/');
            var libFileName = path.basename(libFilePath, '.ts');
            var nameSections = libFileName.split('.');
            var visibleName = tidyName(nameSections[0]) + ' ' + nameSections[1];
            var relPath = libFilePath.substr(libFilePath.indexOf('/ng2-') + 1);
            var mdListItem = '- [' + visibleName + '](' + relPath + ')';
            listItems.push(mdListItem);
        }
    }
    
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
