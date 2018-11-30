import * as path from "path";

import { select } from "unist-util-select";

import * as ngHelpers from "../ngHelpers";


const angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(directive)|(interface)|(model)|(pipe)|(service)|(widget))/;


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
        
        if (titleHeading.children[0].type === "text") {
            let titleText = titleHeading.children[0];

            titleHeading.children[0] = {
                type: 'link',
                url: `../../${sourcePath}`,
                title: `Defined in ${path.basename(sourcePath)}`,
                children: [titleText]
            }
        } else if (titleHeading.children[0].type === "link") {
            let linkElem = titleHeading.children[0];
            linkElem.url = `../../${sourcePath}`;
            linkElem.title = `Defined in ${path.basename(sourcePath)}`;
        }
    });
}