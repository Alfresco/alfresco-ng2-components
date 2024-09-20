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
import { TaskListCloudModule } from './task-list/task-list-cloud.module';
import { TaskFiltersCloudModule } from './task-filters/task-filters-cloud.module';
import { TaskFormCloudComponent } from './task-form/components/task-form-cloud.component';
import { StartTaskCloudComponent } from './start-task/components/start-task-cloud.component';
import { TaskHeaderCloudComponent } from './task-header/components/task-header-cloud.component';
import { CompleteTaskDirective } from './directives/complete-task.directive';
import { ClaimTaskCloudDirective } from './directives/claim-task-cloud.directive';
import { UnClaimTaskCloudDirective } from './directives/unclaim-task-cloud.directive';

@NgModule({
    imports: [
        TaskListCloudModule,
        TaskFiltersCloudModule,
        StartTaskCloudComponent,
        TaskHeaderCloudComponent,
        TaskFormCloudComponent,
        CompleteTaskDirective,
        ClaimTaskCloudDirective,
        UnClaimTaskCloudDirective
    ],
    exports: [
        TaskListCloudModule,
        TaskFiltersCloudModule,
        StartTaskCloudComponent,
        TaskHeaderCloudComponent,
        TaskFormCloudComponent,
        CompleteTaskDirective,
        ClaimTaskCloudDirective,
        UnClaimTaskCloudDirective
    ]
})
export class TaskCloudModule {}
