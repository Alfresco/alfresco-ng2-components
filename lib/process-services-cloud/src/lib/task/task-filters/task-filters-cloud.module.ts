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
import { TaskFiltersCloudComponent } from './components/task-filters/task-filters-cloud.component';
import { EditServiceTaskFilterCloudComponent } from './components/edit-task-filters/edit-service-task-filter/edit-service-task-filter-cloud.component';
import { EditTaskFilterCloudComponent } from './components/edit-task-filters/edit-task-filter/edit-task-filter-cloud.component';
import { TaskFilterDialogCloudComponent } from './components/task-filter-dialog/task-filter-dialog-cloud.component';
import { ServiceTaskFiltersCloudComponent } from './components/service-task-filters/service-task-filters-cloud.component';
import { TaskAssignmentFilterCloudComponent } from './components/task-assignment-filter/task-assignment-filter.component';

export const TASK_FILTERS_CLOUD_DIRECTIVES = [
    TaskFilterDialogCloudComponent,
    TaskFiltersCloudComponent,
    ServiceTaskFiltersCloudComponent,
    EditTaskFilterCloudComponent,
    TaskAssignmentFilterCloudComponent,
    EditServiceTaskFilterCloudComponent
] as const;

/** @deprecated use ...TASK_FILTERS_CLOUD_DIRECTIVES instead */
@NgModule({
    imports: [...TASK_FILTERS_CLOUD_DIRECTIVES],
    exports: [...TASK_FILTERS_CLOUD_DIRECTIVES]
})
export class TaskFiltersCloudModule {}
