/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { FileModel } from '@alfresco/adf-core';
import { Input } from '@angular/core';

export abstract class UploadBase {

    @Input()
    acceptedFilesType: string = '*';

    constructor() {}
    /**
     * Checks if the given file is allowed by the extension filters
     *
     * @param file FileModel
     */
    protected isFileAcceptable(file: FileModel): boolean {
        if (this.acceptedFilesType === '*') {
            return true;
        }

        const allowedExtensions = this.acceptedFilesType
            .split(',')
            .map(ext => ext.replace(/^\./, ''));

        if (allowedExtensions.indexOf(file.extension) !== -1) {
            return true;
        }

        return false;
    }
}
