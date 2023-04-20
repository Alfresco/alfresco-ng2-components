/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as path from 'path';
import * as fs from 'fs';
import { selectAll } from 'unist-util-select';
import * as lev from 'fast-levenshtein';
import * as ngHelpers from '../ngHelpers';

const imageFolderPath = path.resolve('docs', 'docassets', 'images');

// Using this value for the edit distance between Markdown image URLs
// and filenames is enough to trap errors like missing out the 'images'
// folder in the path. Keeping it low avoids crazy suggestions.
const maxImagePathLevDistance = 7;

export function processDocs(mdCache, aggData) {
    const pathnames = Object.keys(mdCache);

    const classlessDocs = [];
    const linkRefs = {};
    const imageRefs = {};
    const brokenImageRefs = {};

    const filters = makeFilepathFilters(aggData.config['fileCheckerFilter']);

    pathnames.forEach(pathname => {

        const fileBaseName = path.basename(pathname, '.md');
        const tree = mdCache[pathname].mdOutTree;
        const className = ngHelpers.ngNameToClassName(fileBaseName, aggData.config.typeNameExceptions);
        const classInfo = aggData.classInfo[className];

        if (!classInfo) {
            if (!filterFilepath(filters, pathname)) {
                classlessDocs.push(pathname);
            }
        } else {
            const linkElems = selectAll('link', tree);

            linkElems.forEach(linkElem => {
                const normUrl = normaliseLinkPath(pathname, linkElem.url);
                multiSetAdd(linkRefs, normUrl, pathname);
            });
        }

        const imageElems = selectAll('image', tree);

        imageElems.forEach(imageElem => {
            const normUrl = normaliseLinkPath(pathname, imageElem.url);
            multiSetAdd(imageRefs, normUrl, pathname);

            if (!fs.existsSync(normUrl)) {
                brokenImageRefs[normUrl] = pathname;
            }
        });
    });

    classlessDocs.forEach(docPath => {
        const relDocPath = docPath.substring(docPath.indexOf('docs'));
        console.group(`Warning: no source class found for "${relDocPath}"`);

        if (linkRefs[docPath]) {
            linkRefs[docPath].forEach(linkRef => {
                const relLinkPath = linkRef.substring(linkRef.indexOf('docs'));
                console.log(`Linked from: "${relLinkPath}"`);
            });
        }

        console.groupEnd();
    });

    console.log();

    const imagePaths = getImagePaths(imageFolderPath);

    imagePaths.forEach(imagePath => {
        if (!imageRefs[imagePath]) {
            const relImagePath = imagePath.substring(imagePath.indexOf('docs'));
            console.log(`Warning: no links to image file "${relImagePath}"`);
        }
    });

    console.log();

    const brokenImUrls = Object.keys(brokenImageRefs);

    brokenImUrls.forEach(url => {
        const relUrl = url.substring(url.indexOf('docs'));
        const relDocPath = brokenImageRefs[url].substring(brokenImageRefs[url].indexOf('docs'));
        console.group(`Broken image link "${relUrl}" found in "${relDocPath}`);

        imagePaths.forEach(imPath => {
            if (lev.get(imPath, url) <= maxImagePathLevDistance) {
                const relImPath = imPath.substring(imPath.indexOf('docs'));
                console.log(`Should it be "${relImPath}"?`);
            }
        });

        console.groupEnd();
    });
}

function normaliseLinkPath(homeFilePath, linkUrl) {
    const homeFolder = path.dirname(homeFilePath);
    return path.resolve(homeFolder, linkUrl);
}

function getImagePaths(imageFolder) {
    const files = fs.readdirSync(imageFolder);
    return files.map(f => path.resolve(imageFolder, f));
}

function makeFilepathFilters(patterns: string[]) {
    return patterns.map(r => new RegExp(r));
}

function filterFilepath(filters: RegExp[], filepath: string): boolean {
    for (let i = 0; i < filters.length; i++) {
        if (filters[i].test(filepath)) {
            return true;
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
