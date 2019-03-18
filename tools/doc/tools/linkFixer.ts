import * as path from 'path';
import * as fs from 'fs';

import { selectAll } from 'unist-util-select';
import { MDAST } from 'mdast';


const angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(dialog)|(directive)|(interface)|(model)|(pipe)|(service)|(widget))/;
const suffixesNotToCheck = /\.ts/;

export function processDocs(mdCache, aggData, errorMessages) {
    var pathnames = Object.keys(mdCache);

    let linkSet = new LinkSet(pathnames);
    
    let imageFolderPath = path.resolve(aggData['rootFolder'], 'docassets', 'images');

    let imageSet = new LinkSet(getImagePaths(imageFolderPath));

    pathnames.forEach(pathname => {
        let fileBaseName = path.basename(pathname, '.md');

        if (!fileBaseName.match(angFilenameRegex)) {
            return;
        }

        let tree = mdCache[pathname].mdOutTree;
        
        //fixUrls(tree, pathname, linkSet, 'link');
        fixUrls(tree, pathname, imageSet, 'image');
    });
}


function fixUrls(tree: MDAST.Root, docFilePath: string, linkSet: LinkSet, selector: string) {
    let linksInDoc = selectAll(selector, tree);

    console.log(`File: ${docFilePath}:`);

    linksInDoc.forEach(linkElem => {
        let origFullUrlPath = path.resolve(path.dirname(docFilePath), linkElem.url);

        if (!linkElem.url.match(/http:|https:|ftp:|mailto:/) &&
            !path.extname(linkElem.url).match(suffixesNotToCheck) &&
            !fs.existsSync(origFullUrlPath)
        ) {
            let newUrl = linkSet.update(origFullUrlPath) || origFullUrlPath; 
            linkElem.url = path.relative(path.dirname(docFilePath), newUrl).replace(/\\/g,'/');
            console.log(`Bad link: ${origFullUrlPath}`)
            console.log(`Replacing with ${linkElem.url}`);
        } else {
            console.log(`Link OK: ${origFullUrlPath}`);
        }
    });
}


/*
function fixImages(tree: MDAST.Root, docFilePath: string, imageMap: Map<string, string>) {
    let imagesInDoc = selectAll('image', tree);

    console.log(`File: ${docFilePath}:`);

    imagesInDoc.forEach(image => {
        let imageElem: MDAST.Image = image;
        let origFullUrlPath = path.resolve(path.dirname(docFilePath), imageElem.u);

        if (!linkElem.url.match(/http:|https:|ftp:|mailto:/) &&
            path.extname(linkElem.url) === '.md' &&
            !fs.existsSync(origFullUrlPath)
        ) {
            let newUrl = linkSet.update(origFullUrlPath) || origFullUrlPath; 
            linkElem.url = path.relative(path.dirname(docFilePath), newUrl);
            console.log(`Bad link: ${origFullUrlPath}`)
            console.log(`Replacing with ${linkElem.url}`);
        } else {
            console.log(`Link OK: ${origFullUrlPath}`);
        }
    });
}
*/

function getImagePaths(imageFolderPath: string): string[] {
    /*
    let result = new Map<string, string>();

    let imageFileNames = fs.readdirSync(imageFolderPath);

    imageFileNames.forEach(imageFileName => {
        let fullImagePath = ;
        result.set(imageFileName, fullImagePath);
    });
    */
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
