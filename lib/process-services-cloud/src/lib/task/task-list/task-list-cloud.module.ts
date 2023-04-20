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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { TaskListCloudComponent } from './components/task-list-cloud.component';
import { ServiceTaskListCloudComponent } from './components/service-task-list-cloud.component';
import { CoreModule } from '@alfresco/adf-core';
import { TASK_LIST_CLOUD_TOKEN, TASK_LIST_PREFERENCES_SERVICE_TOKEN } from '../../services/cloud-token.service';
import { TaskListCloudService } from './services/task-list-cloud.service';
import { LocalPreferenceCloudService } from '../../services/local-preference-cloud.service';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CoreModule
    ],
    declarations: [
        TaskListCloudComponent,
        ServiceTaskListCloudComponent
    ],
    exports: [
        TaskListCloudComponent,
        ServiceTaskListCloudComponent
    ],
    providers: [
        {
            provide: TASK_LIST_CLOUD_TOKEN,
            useClass: TaskListCloudService
        },
        {
            provide: TASK_LIST_PREFERENCES_SERVICE_TOKEN,
            useClass: LocalPreferenceCloudService
        }
    ]
})
export class TaskListCloudModule { }
