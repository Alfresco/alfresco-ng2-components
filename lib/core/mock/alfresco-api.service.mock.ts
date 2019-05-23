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

import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { StorageService } from '../services/storage.service';

/* tslint:disable:adf-file-name */
@Injectable()
export class AlfrescoApiServiceMock extends AlfrescoApiService {

    constructor(protected appConfig: AppConfigService,
                protected storageService: StorageService) {
        super(appConfig, storageService);
        if (!this.alfrescoApi) {
            this.initAlfrescoApi();
        }
    }

    initialize(): Promise<any> {
        return new Promise((resolve) => {
            this.alfrescoApiInitializedSubject.next();
            resolve();
        });
    }
}
