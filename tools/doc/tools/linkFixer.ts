import * as path from 'path';
import * as fs from 'fs';

import { selectAll } from 'unist-util-select';
import { MDAST } from 'mdast';

const suffixesNotToCheck = /\.ts/;

export function processDocs(mdCache, aggData, errorMessages) {
    var pathnames = Object.keys(mdCache);

    let linkSet = new LinkSet(pathnames);

    let imageFolderPath = path.resolve(aggData['rootFolder'], 'docs', 'docassets', 'images');

    let imageSet = new LinkSet(getImagePaths(imageFolderPath));

    pathnames.forEach(pathname => {
        let tree = mdCache[pathname].mdOutTree;

        fixUrls(tree, pathname, linkSet, 'link');
        fixUrls(tree, pathname, imageSet, 'image');
    });
}


function fixUrls(tree: MDAST.Root, docFilePath: string, linkSet: LinkSet, selector: string) {
    let linksInDoc = selectAll(selector, tree);

    let errors: string[] = [];

    linksInDoc.forEach(linkElem => {
        let origFullUrlPath = path.resolve(path.dirname(docFilePath), linkElem.url);

        let hashPos = origFullUrlPath.indexOf('#');
        let anchor = '';

        if (hashPos !== -1) {
            anchor = origFullUrlPath.substring(hashPos);
            origFullUrlPath = origFullUrlPath.substring(0, hashPos);
        }

        if (!linkElem.url.match(/http:|https:|ftp:|mailto:/) &&
            !path.extname(origFullUrlPath).match(suffixesNotToCheck) &&
            (origFullUrlPath !== '') &&
            !fs.existsSync(origFullUrlPath)
        ) {
            let newUrl = linkSet.update(origFullUrlPath) || origFullUrlPath;
            linkElem.url = path.relative(path.dirname(docFilePath), newUrl).replace(/\\/g,'/') + anchor;
            errors.push(`Bad link: ${origFullUrlPath}\nReplacing with ${linkElem.url}`);
        } /*else {
            console.log(`Link OK: ${origFullUrlPath}`);
        }
        */
    });

    if (errors.length > 0) {
        showMessages(`File: ${docFilePath}:`, errors);
    }
}


function showMessages(groupName: string, messages: string[]) {
    console.group(groupName);

    messages.forEach(message => {
        console.log(message);
    });

    console.groupEnd();
}

function getImagePaths(imageFolderPath: string): string[] {
    return fs.readdirSync(imageFolderPath)
    .map(imageFileName => path.resolve(imageFolderPath, imageFileName));
}


class LinkSet {
    links: Map<string, string[]>;

    constructor(urls: string[]) {
        this.links = new Map();

        urls.forEach(url => {
            let fileName = path.basename(url);

            if (this.links.has(fileName)) {
                let item = this.links.get(fileName);
                item.push(url);
            } else {
                this.links.set(fileName, [url]);
            }
        });
    }

    update(oldUrl: string): string {
        let oldFileName = path.basename(oldUrl);

        if (!this.links.has(oldFileName)) {
            return '';
        } else {
            let candidates = this.links.get(oldFileName);

            if (candidates.length === 1) {
                return candidates[0];
            } else {
                console.log(`Multiple candidates for ${oldUrl}`);
                return '';
            }
        }
    }
}
