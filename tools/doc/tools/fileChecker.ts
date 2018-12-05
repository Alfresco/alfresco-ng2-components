import * as path from "path";
import * as fs from "fs";

import { select, selectAll } from "unist-util-select";

import * as lev from "fast-levenshtein";

import * as ngHelpers from "../ngHelpers";


const imageFolderPath = path.resolve('docs', 'docassets', 'images');

// Using this value for the edit distance between Markdown image URLs
// and filenames is enough to trap errors like missing out the 'images'
// folder in the path. Keeping it low avoids crazy suggestions.
const maxImagePathLevDistance = 7;



export function processDocs(mdCache, aggData, errorMessages) {
    var pathnames = Object.keys(mdCache);

    let classlessDocs = [];
    let linkRefs = {};
    let imageRefs = {};
    let brokenImageRefs = {};

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
                multiSetAdd(linkRefs, normUrl, pathname);
            });
        }

        let imageElems = selectAll('image', tree);

        imageElems.forEach(imageElem => {
            let normUrl = normaliseLinkPath(pathname, imageElem.url);
            multiSetAdd(imageRefs, normUrl, pathname);

            if (!fs.existsSync(normUrl)) {
                brokenImageRefs[normUrl] = pathname;
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

    console.log();

    let imagePaths = getImagePaths(imageFolderPath);

    imagePaths.forEach(imagePath => {
        if (!imageRefs[imagePath]) {
            let relImagePath = imagePath.substring(imagePath.indexOf('docs'));
            console.log(`Warning: no links to image file "${relImagePath}"`);
        }
    });

    console.log();

    let brokenImUrls = Object.keys(brokenImageRefs);

    brokenImUrls.forEach(url => {
        let relUrl = url.substring(url.indexOf('docs'));
        let relDocPath = brokenImageRefs[url].substring(brokenImageRefs[url].indexOf('docs'));
        console.group(`Broken image link "${relUrl}" found in "${relDocPath}`);

        imagePaths.forEach(imPath => {
            if (lev.get(imPath, url) <= maxImagePathLevDistance) {
                let relImPath = imPath.substring(imPath.indexOf('docs'));
                console.log(`Should it be "${relImPath}"?`)
            }
        });

        console.groupEnd();
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


function multiSetAdd(container: {}, key: string, value: string) {
    if (container[key]) {
        container[key].push(value);
    } else {
        container[key] = [ value ];
    }
}