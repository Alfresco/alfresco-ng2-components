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
import { TASK_FILTERS_CLOUD_DIRECTIVES } from './task-filters/task-filters-cloud.module';
import { TASK_DIRECTIVES } from './directives/task-directive.module';
import { TASK_FORM_CLOUD_DIRECTIVES } from './task-form/task-form.module';
import { TaskHeaderCloudComponent } from './task-header/components/task-header-cloud.component';

@NgModule({
    imports: [TaskListCloudModule, ...TASK_FILTERS_CLOUD_DIRECTIVES, TaskHeaderCloudComponent, ...TASK_DIRECTIVES, ...TASK_FORM_CLOUD_DIRECTIVES],
    exports: [TaskListCloudModule, ...TASK_FILTERS_CLOUD_DIRECTIVES, TaskHeaderCloudComponent, ...TASK_DIRECTIVES, ...TASK_FORM_CLOUD_DIRECTIVES]
})
export class TaskCloudModule {}
