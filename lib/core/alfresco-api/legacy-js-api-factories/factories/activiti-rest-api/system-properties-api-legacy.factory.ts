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

import { SystemPropertiesApi } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { AlfrescoApiService } from '../../../../services/alfresco-api.service';
import { AbstractApiFactory } from '../../../abstract-api.factory';

@Injectable()
export class SystemPropertiesApiLegacyFactory extends AbstractApiFactory<SystemPropertiesApi> {
    constructor(private alfrescoApiService: AlfrescoApiService) {
        super();
    }

    instantiateApi(): SystemPropertiesApi {
        return new SystemPropertiesApi(this.alfrescoApiService.getInstance());
    }
}
