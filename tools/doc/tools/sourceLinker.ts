import * as path from "path";

import { select } from "unist-util-select";

import * as ngHelpers from "../ngHelpers";


const angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(dialog)|(directive)|(interface)|(model)|(pipe)|(service)|(widget))/;


export function processDocs(mdCache, aggData, errorMessages) {
    var pathnames = Object.keys(mdCache);

    pathnames.forEach(pathname => {
        let fileBaseName = path.basename(pathname, '.md');

        if (!fileBaseName.match(angFilenameRegex)) {
            return;
        }

        let tree = mdCache[pathname].mdOutTree;
        let className = ngHelpers.ngNameToClassName(fileBaseName, aggData.config.typeNameExceptions);
        let classInfo = aggData.classInfo[className];
        let sourcePath = classInfo ? classInfo.sourcePath : '';
        let titleHeading = select('heading[depth=1]:first-of-type', tree);
        let relDocPath = pathname.substring(pathname.indexOf('docs'));
        let srcUrl = fixRelSrcUrl(relDocPath, sourcePath);

        if (titleHeading.children[0].type === "text") {
            let titleText = titleHeading.children[0];
            titleHeading.children[0] = {
                type: 'link',
                url: srcUrl,//`../../${sourcePath}`,
                title: `Defined in ${path.basename(sourcePath)}`,
                children: [titleText]
            }
        } else if ((titleHeading.children[0].type === "link") && sourcePath) {
            let linkElem = titleHeading.children[0];
            linkElem.url = srcUrl, //`../../${sourcePath}`;
            linkElem.title = `Defined in ${path.basename(sourcePath)}`;
        }
    });
}


function fixRelSrcUrl(docPath: string, srcPath: string) {
    let docPathSegments = docPath.split(/[\\\/]/);
    let dotPathPart = '';

    for (let i = 0; i < (docPathSegments.length - 1); i++) {
        dotPathPart += '../';
    }

    return dotPathPart + srcPath;
}