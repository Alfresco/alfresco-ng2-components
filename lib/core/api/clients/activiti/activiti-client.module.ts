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

import { AboutApi, SystemPropertiesApi } from '@alfresco/js-api';
import { NgModule } from '@angular/core';
import { ApiClientsService } from '../../api-clients.service';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace AlfrescoCore {
        interface ApiRegistry {
            ['ActivitiClient.about']: AboutApi;
            ['ActivitiClient.system-properties']: SystemPropertiesApi;
        }
    }
}

@NgModule({})
export class ActivitiClientModule {
    constructor(private apiClientsService: ApiClientsService) {
        this.apiClientsService.register('ActivitiClient.about', AboutApi);
        this.apiClientsService.register('ActivitiClient.system-properties', SystemPropertiesApi);
    }
}
