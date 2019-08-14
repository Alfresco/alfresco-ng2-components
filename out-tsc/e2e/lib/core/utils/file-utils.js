"use strict";
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
Object.defineProperty(exports, "__esModule", { value: true });
var FileUtils = /** @class */ (function () {
    function FileUtils() {
    }
    FileUtils.flatten = function (folder) {
        var reader = folder.createReader();
        var files = [];
        return new Promise(function (resolve) {
            var iterations = [];
            (function traverse() {
                reader.readEntries(function (entries) {
                    if (!entries.length) {
                        Promise.all(iterations).then(function () { return resolve(files); });
                    }
                    else {
                        iterations.push(Promise.all(entries.map(function (entry) {
                            if (entry.isFile) {
                                return new Promise(function (resolveFile) {
                                    entry.file(function (file) {
                                        files.push({
                                            entry: entry,
                                            file: file,
                                            relativeFolder: entry.fullPath.replace(/\/[^\/]*$/, '')
                                        });
                                        resolveFile();
                                    });
                                });
                            }
                            else {
                                return FileUtils.flatten(entry).then(function (result) {
                                    files.push.apply(files, result);
                                });
                            }
                        })));
                        // Try calling traverse() again for the same dir, according to spec
                        traverse();
                    }
                });
            })();
        });
    };
    FileUtils.toFileArray = function (fileList) {
        var result = [];
        if (fileList && fileList.length > 0) {
            for (var i = 0; i < fileList.length; i++) {
                result.push(fileList[i]);
            }
        }
        return result;
    };
    return FileUtils;
}());
exports.FileUtils = FileUtils;
//# sourceMappingURL=file-utils.js.map