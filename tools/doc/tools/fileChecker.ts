import * as path from "path";
import * as fs from "fs";

import { select, selectAll } from "unist-util-select";

import * as ngHelpers from "../ngHelpers";


//const angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(directive)|(interface)|(model)|(pipe)|(service)|(widget))/;
const imageFolderPath = path.resolve('docs', 'docassets', 'images');


export function processDocs(mdCache, aggData, errorMessages) {
    var pathnames = Object.keys(mdCache);

    let classlessDocs = [];
    let linkRefs = {};
    let imageRefs = {};

    let filters = makeFilepathFilters(aggData.config["fileCheckerFilter"]);

    pathnames.forEach(pathname => {

        let fileBaseName = path.basename(pathname, '.md');
        let tree = mdCache[pathname].mdOutTree;
        let className = ngHelpers.ngNameToClassName(fileBaseName, aggData.config.typeNameExceptions);
        let classInfo = aggData.classInfo[className];

        if (!classInfo) {
            if (!filterFilepath(filters, pathname)) {
                classlessDocs.push(pathname);
            }
        } else {
            let linkElems = selectAll('link', tree);
            
            linkElems.forEach(linkElem => {
                let normUrl = normaliseLinkPath(pathname, linkElem.url);

                if (linkRefs[normUrl]) {
                    linkRefs[normUrl].push(pathname);
                } else {
                    linkRefs[normUrl] = [ pathname ];
                }
            });
        }

        let imageElems = selectAll('image', tree);

        imageElems.forEach(imageElem => {
            let normUrl = normaliseLinkPath(pathname, imageElem.url);

            if (imageRefs[normUrl]) {
                imageRefs[normUrl].push(pathname);
            } else {
                imageRefs[normUrl] = [ pathname ];
            }
        });
    });

    classlessDocs.forEach(docPath => {
        let relDocPath = docPath.substring(docPath.indexOf('docs'));
        console.group(`Warning: no source class found for "${relDocPath}"`);

        if (linkRefs[docPath]) {
            linkRefs[docPath].forEach(linkRef => {
                let relLinkPath = linkRef.substring(linkRef.indexOf('docs'));
                console.log(`Linked from: "${relLinkPath}"`);
            });
        }

        console.groupEnd();
    });

    let imagePaths = getImagePaths(imageFolderPath);

    imagePaths.forEach(imagePath => {
        if (!imageRefs[imagePath]) {
            let relImagePath = imagePath.substring(imagePath.indexOf('docs'));
            console.log(`Warning: no links to image file "${relImagePath}"`);
        }
    });
}


function normaliseLinkPath(homeFilePath, linkUrl) {
    let homeFolder = path.dirname(homeFilePath);
    return path.resolve(homeFolder, linkUrl);
}


function getImagePaths(imageFolder) {
    let files = fs.readdirSync(imageFolder);
    return files.map(f => path.resolve(imageFolder, f));
}


function makeFilepathFilters(regexes: string[]) {
    return regexes.map(r => new RegExp(r));
}


function filterFilepath(filters: RegExp[], filepath: string): boolean {
    for (let i = 0; i < filters.length; i++) {
        if (filters[i].test(filepath)) {
            return true
        }
    }
    return false;
}