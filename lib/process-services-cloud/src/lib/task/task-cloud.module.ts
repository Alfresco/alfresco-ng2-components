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
import { TASK_FILTERS_CLOUD_DIRECTIVES } from './task-filters/task-filters-cloud.module';
import { TaskFormCloudComponent } from './task-form/components/task-form-cloud.component';
import { StartTaskCloudComponent } from './start-task/components/start-task-cloud.component';
import { TaskHeaderCloudComponent } from './task-header/components/task-header-cloud.component';
import { CompleteTaskDirective } from './directives/complete-task.directive';
import { ClaimTaskCloudDirective } from './directives/claim-task-cloud.directive';
import { UnClaimTaskCloudDirective } from './directives/unclaim-task-cloud.directive';
import { TaskListCloudComponent } from './task-list/components/task-list-cloud.component';
import { ServiceTaskListCloudComponent } from './task-list/components/service-task-list-cloud.component';

export const TASK_CLOUD_DIRECTIVES = [
    TaskListCloudComponent,
    ServiceTaskListCloudComponent,
    ...TASK_FILTERS_CLOUD_DIRECTIVES,
    StartTaskCloudComponent,
    TaskHeaderCloudComponent,
    TaskFormCloudComponent,
    CompleteTaskDirective,
    ClaimTaskCloudDirective,
    UnClaimTaskCloudDirective
] as const;

/** @deprecated import individual standalone components instead */
@NgModule({
    imports: [...TASK_CLOUD_DIRECTIVES],
    exports: [...TASK_CLOUD_DIRECTIVES]
})
export class TaskCloudModule {}
