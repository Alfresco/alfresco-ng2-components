/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { TaskListCloudComponent } from './components/task-list/task-list-cloud.component';
import { ServiceTaskListCloudComponent } from './components/service-task-list/service-task-list-cloud.component';
import { TASK_LIST_CLOUD_TOKEN, TASK_LIST_PREFERENCES_SERVICE_TOKEN } from '../../services/cloud-token.service';
import { TaskListCloudService } from './services/task-list-cloud.service';
import { LocalPreferenceCloudService } from '../../services/local-preference-cloud.service';

export const TASK_LIST_CLOUD_DIRECTIVES = [TaskListCloudComponent, ServiceTaskListCloudComponent] as const;

/** @deprecated use standalone components or TASK_LIST_CLOUD_DIRECTIVES instead */
@NgModule({
    imports: [...TASK_LIST_CLOUD_DIRECTIVES],
    exports: [...TASK_LIST_CLOUD_DIRECTIVES],
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
export class TaskListCloudModule {}
