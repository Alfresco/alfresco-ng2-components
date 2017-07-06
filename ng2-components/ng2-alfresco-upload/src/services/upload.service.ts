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

import { EventEmitter, Injectable } from '@angular/core';
import { AlfrescoApiService, BaseUploadService, FileModel } from 'ng2-alfresco-core';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class UploadService extends BaseUploadService {

    instanceApi: AlfrescoApiService;

    constructor(apiService: AlfrescoApiService) {
        super(apiService);
        this.instanceApi = apiService;
    }

    getUploadPromise(file: FileModel) {
        let opts: any = {
            renditions: 'doclib'
        };

        if (file.options.newVersion === true) {
            opts.overwrite = true;
            opts.majorVersion = true;
        } else {
            opts.autoRename = true;
        }

        return this.instanceApi.getInstance().upload.uploadFile(
            file.file,
            file.options.path,
            file.options.parentId,
            null,
            opts
        );
    }
}
