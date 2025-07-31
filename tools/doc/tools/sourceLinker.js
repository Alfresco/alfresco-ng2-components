'use strict';
/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
Object.defineProperty(exports, '__esModule', { value: true });
exports.processDocs = processDocs;
var path = require('path');
var unist_util_select_1 = require('unist-util-select');
var ngHelpers = require('../ngHelpers');
var angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(dialog)|(directive)|(interface)|(model)|(pipe)|(service)|(widget))/;
function processDocs(mdCache, aggData) {
    var pathnames = Object.keys(mdCache);
    pathnames.forEach(function (pathname) {
        var fileBaseName = path.basename(pathname, '.md');
        if (!fileBaseName.match(angFilenameRegex)) {
            return;
        }
        var tree = mdCache[pathname].mdOutTree;
        var className = ngHelpers.ngNameToClassName(fileBaseName, aggData.config.typeNameExceptions);
        var classInfo = aggData.classInfo[className];
        var sourcePath = classInfo ? classInfo.sourcePath : '';
        var titleHeading = (0, unist_util_select_1.select)('heading[depth=1]:first-of-type', tree);
        var relDocPath = pathname.substring(pathname.indexOf('docs'));
        var srcUrl = fixRelSrcUrl(relDocPath, sourcePath);
        if (titleHeading && titleHeading.children[0] && titleHeading.children[0].type === 'text') {
            var titleText = titleHeading.children[0];
            titleHeading.children[0] = {
                type: 'link',
                url: srcUrl, // `../../${sourcePath}`,
                title: 'Defined in '.concat(path.basename(sourcePath)),
                children: [titleText]
            };
        } else if (titleHeading && titleHeading.children[0].type === 'link' && sourcePath) {
            var linkElem = titleHeading.children[0];
            ((linkElem.url = srcUrl), // `../../${sourcePath}`;
                (linkElem.title = 'Defined in '.concat(path.basename(sourcePath))));
        }
    });
}
function fixRelSrcUrl(docPath, srcPath) {
    var docPathSegments = docPath.split(/[\\\/]/);
    var dotPathPart = '';
    for (var i = 0; i < docPathSegments.length - 1; i++) {
        dotPathPart += '../';
    }
    return dotPathPart + srcPath;
}
