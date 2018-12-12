var fs = require("fs");
var path = require("path");

module.exports = searchLibraryRecursive;

var angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(dialog)|(directive)|(model)|(pipe)|(service)|(widget))\.ts/;
var searchFolderOmitRegex = /(config)|(mock)|(i18n)|(assets)|(styles)/;

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