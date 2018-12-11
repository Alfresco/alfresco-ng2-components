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

import { NgModule } from '@angular/core';
import { TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { AppListCloudModule } from './app-list-cloud/app-list-cloud.module';
import { TaskCloudModule } from './task-cloud/task-cloud.module';
import { ProcessListCloudModule } from './process-list-cloud/process-list-cloud.module';
import { ProcessCloudModule } from './process-cloud/process-cloud.module';
import { StartTaskCloudModule } from './start-task-cloud/start-task-cloud.module';

@NgModule({
    imports: [
        AppListCloudModule,
        TaskCloudModule,
        ProcessListCloudModule,
        ProcessCloudModule,
        StartTaskCloudModule
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'adf-process-services-cloud',
                source: 'assets/adf-process-services-cloud'
            }
        }
    ],
    exports: [
        AppListCloudModule,
        TaskCloudModule,
        ProcessListCloudModule,
        ProcessCloudModule,
        StartTaskCloudModule
    ]
})
export class ProcessServicesCloudModule { }
