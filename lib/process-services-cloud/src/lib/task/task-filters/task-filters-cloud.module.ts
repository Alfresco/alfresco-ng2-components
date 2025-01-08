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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskFiltersCloudComponent } from './components/task-filters/task-filters-cloud.component';
import { MaterialModule } from '../../material.module';
import { CoreModule } from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';
import { ProcessCommonModule } from '../../common/process-common.module';
import { PeopleCloudModule } from '../../people/people-cloud.module';
import { EditServiceTaskFilterCloudComponent } from './components/edit-task-filters/edit-service-task-filter/edit-service-task-filter-cloud.component';
import { EditTaskFilterCloudComponent } from './components/edit-task-filters/edit-task-filter/edit-task-filter-cloud.component';
import { TaskFilterDialogCloudComponent } from './components/task-filter-dialog/task-filter-dialog-cloud.component';
import { ServiceTaskFiltersCloudComponent } from './components/service-task-filters/service-task-filters-cloud.component';
import { TaskAssignmentFilterCloudComponent } from './components/task-assignment-filter/task-assignment-filter.component';
import { GroupCloudModule } from '../../group/group-cloud.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { APP_LIST_CLOUD_DIRECTIVES } from '../../app/app-list-cloud.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule,
        MaterialModule,
        ...APP_LIST_CLOUD_DIRECTIVES,
        CoreModule,
        GroupCloudModule,
        ProcessCommonModule,
        PeopleCloudModule,
        MatProgressSpinnerModule,
        TaskFilterDialogCloudComponent
    ],
    declarations: [
        TaskFiltersCloudComponent,
        ServiceTaskFiltersCloudComponent,
        EditTaskFilterCloudComponent,
        EditServiceTaskFilterCloudComponent,
        TaskAssignmentFilterCloudComponent
    ],
    exports: [TaskFiltersCloudComponent, ServiceTaskFiltersCloudComponent, EditTaskFilterCloudComponent, EditServiceTaskFilterCloudComponent]
})
export class TaskFiltersCloudModule {}
