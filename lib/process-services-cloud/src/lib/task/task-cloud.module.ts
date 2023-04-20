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
import { TaskListCloudModule } from './task-list/task-list-cloud.module';
import { TaskFiltersCloudModule } from './task-filters/task-filters-cloud.module';
import { StartTaskCloudModule } from './start-task/start-task-cloud.module';
import { TaskHeaderCloudModule } from './task-header/task-header-cloud.module';
import { TaskDirectiveModule } from './directives/task-directive.module';
import { TaskFormModule } from './task-form/task-form.module';

@NgModule({
    imports: [
        TaskListCloudModule,
        TaskFiltersCloudModule,
        StartTaskCloudModule,
        TaskHeaderCloudModule,
        TaskDirectiveModule,
        TaskFormModule
    ],
    exports: [
        TaskListCloudModule,
        TaskFiltersCloudModule,
        StartTaskCloudModule,
        TaskHeaderCloudModule,
        TaskDirectiveModule,
        TaskFormModule
    ]
})
export class TaskCloudModule { }
