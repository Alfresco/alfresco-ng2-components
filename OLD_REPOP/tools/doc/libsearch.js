const fs = require('fs');
const path = require('path');

const angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(dialog)|(directive)|(model)|(pipe)|(service)|(widget))\.ts/;
const searchFolderOmitRegex = /(config)|(mock)|(i18n)|(assets)|(styles)/;

//  Search source folders for .ts files to discover all components, directives, etc.
function searchLibraryRecursive(srcData, folderPath) {
    const items = fs.readdirSync(folderPath);

    for (let i = 0; i < items.length; i++) {
        const itemPath = path.resolve(folderPath, items[i]);
        const info = fs.statSync(itemPath);

        if (info.isFile() && items[i].match(angFilenameRegex)) {
            const nameNoSuffix = path.basename(items[i], '.ts');

            let displayPath = itemPath.replace(/\\/g, '/');
            displayPath = displayPath.substring(displayPath.indexOf('lib') + 4);

            // Type == "component", "directive", etc.
            const itemType = nameNoSuffix.split('.')[1];

            srcData[nameNoSuffix] = { path: displayPath, type: itemType };
        } else if (info.isDirectory() && !items[i].match(searchFolderOmitRegex)) {
            searchLibraryRecursive(srcData, itemPath);
        }
    }
}

module.exports = searchLibraryRecursive;
