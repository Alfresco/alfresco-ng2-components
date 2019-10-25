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

export interface FileInfo {
    entry?: any;
    file?: File;
    relativeFolder?: string;
}

export class FileUtils {

    static flatten(folder: any): Promise<FileInfo[]> {
        const reader = folder.createReader();
        const files: FileInfo[] = [];
        return new Promise((resolve) => {
            const iterations = [];
            (function traverse() {
                reader.readEntries((entries) => {
                    if (!entries.length) {
                        Promise.all(iterations).then(() => resolve(files));
                    } else {
                        iterations.push(Promise.all(entries.map((entry) => {
                            if (entry.isFile) {
                                return new Promise((resolveFile) => {
                                    entry.file(function (file: File) {
                                        files.push({
                                            entry: entry,
                                            file: file,
                                            relativeFolder: entry.fullPath.replace(/\/[^\/]*$/, '')
                                        });
                                        resolveFile();
                                    });
                                });
                            } else {
                                return FileUtils.flatten(entry).then((result) => {
                                    files.push(...result);
                                });
                            }
                        })));
                        // Try calling traverse() again for the same dir, according to spec
                        traverse();
                    }
                });
            })();
        });
    }

    static toFileArray(fileList: FileList): File[] {
        const result = [];

        if (fileList && fileList.length > 0) {
            for (let i = 0; i < fileList.length; i++) {
                result.push(fileList[i]);
            }
        }

        return result;
    }
}
