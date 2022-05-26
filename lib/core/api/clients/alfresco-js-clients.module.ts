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

import { NgModule } from '@angular/core';
import { ApiClientsService } from '../api-clients.service';
import { ActivitiClientModule } from './activiti/activiti-client.module';
import { ContentCustomClientModule } from './content-custom/content-custom-client.module';
import { ContentClientModule } from './content/content-client.module';
import { DiscoveryClientModule } from './discovery/discovery-client.module';
import { ModelClientModule } from './model/model-client.module';
import { SearchClientModule } from './search/search-client.module';

@NgModule({
    imports: [
        ActivitiClientModule,
        DiscoveryClientModule,
        SearchClientModule,
        ModelClientModule,
        ContentCustomClientModule,
        ContentClientModule
    ],
    providers: [
        ApiClientsService
    ]
})
export class AlfrescoJsClientsModule { }
