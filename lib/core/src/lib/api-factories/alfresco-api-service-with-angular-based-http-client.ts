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

import { AlfrescoApiHttpClient } from '@alfresco/adf-core/api';
import { StorageService } from '../common/services/storage.service';
import { AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config';
import { AlfrescoApiService } from '../services/alfresco-api.service';

@Injectable()
export class AlfrescoApiServiceWithAngularBasedHttpClient extends AlfrescoApiService {
    constructor(
        storage: StorageService,
        appConfig: AppConfigService,
        private readonly alfrescoApiHttpClient: AlfrescoApiHttpClient
    ) {
        super(appConfig, storage);
    }

    override createInstance(config: AlfrescoApiConfig) {
        return new AlfrescoApi(config, this.alfrescoApiHttpClient);
    }
}
