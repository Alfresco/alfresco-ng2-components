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
import { select } from 'unist-util-select';
import * as ngHelpers from '../ngHelpers';

const angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(dialog)|(directive)|(interface)|(model)|(pipe)|(service)|(widget))/;

export function processDocs(mdCache, aggData) {
    const pathnames = Object.keys(mdCache);

    pathnames.forEach(pathname => {
        const fileBaseName = path.basename(pathname, '.md');

        if (!fileBaseName.match(angFilenameRegex)) {
            return;
        }

        const tree = mdCache[pathname].mdOutTree;
        const className = ngHelpers.ngNameToClassName(fileBaseName, aggData.config.typeNameExceptions);
        const classInfo = aggData.classInfo[className];
        const sourcePath = classInfo ? classInfo.sourcePath : '';
        const titleHeading = select('heading[depth=1]:first-of-type', tree);
        const relDocPath = pathname.substring(pathname.indexOf('docs'));
        const srcUrl = fixRelSrcUrl(relDocPath, sourcePath);

        if (titleHeading && titleHeading.children[0] && titleHeading.children[0].type === 'text') {
            const titleText = titleHeading.children[0];
            titleHeading.children[0] = {
                type: 'link',
                url: srcUrl, // `../../${sourcePath}`,
                title: `Defined in ${path.basename(sourcePath)}`,
                children: [titleText]
            };
        } else if ((titleHeading && titleHeading.children[0].type === 'link') && sourcePath) {
            const linkElem = titleHeading.children[0];
            linkElem.url = srcUrl, // `../../${sourcePath}`;
            linkElem.title = `Defined in ${path.basename(sourcePath)}`;
        }
    });
}

function fixRelSrcUrl(docPath: string, srcPath: string) {
    const docPathSegments = docPath.split(/[\\\/]/);
    let dotPathPart = '';

    for (let i = 0; i < (docPathSegments.length - 1); i++) {
        dotPathPart += '../';
    }

    return dotPathPart + srcPath;
}
