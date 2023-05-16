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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskFiltersCloudComponent } from './components/task-filters-cloud.component';
import { MaterialModule } from '../../material.module';
import { CoreModule, MomentDateAdapter, MOMENT_DATE_FORMATS } from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';
import { AppListCloudModule } from './../../app/app-list-cloud.module';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ProcessCommonModule } from '../../common/process-common.module';
import { PeopleCloudModule } from '../../people/people-cloud.module';
import { EditServiceTaskFilterCloudComponent } from './components/edit-task-filters/edit-service-task-filter-cloud.component';
import { EditTaskFilterCloudComponent } from './components/edit-task-filters/edit-task-filter-cloud.component';
import { TaskFilterDialogCloudComponent } from './components/task-filter-dialog/task-filter-dialog-cloud.component';
import { ServiceTaskFiltersCloudComponent } from './components/service-task-filters-cloud.component';
import { TaskAssignmentFilterCloudComponent } from './components/task-assignment-filter/task-assignment-filter.component';
import { GroupCloudModule } from '../../group/group-cloud.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule,
        MaterialModule,
        AppListCloudModule,
        CoreModule,
        GroupCloudModule,
        ProcessCommonModule,
        PeopleCloudModule
    ],
    declarations: [
        TaskFiltersCloudComponent,
        ServiceTaskFiltersCloudComponent,
        EditTaskFilterCloudComponent,
        EditServiceTaskFilterCloudComponent,
        TaskFilterDialogCloudComponent,
        TaskAssignmentFilterCloudComponent
    ],
    exports: [
        TaskFiltersCloudComponent,
        ServiceTaskFiltersCloudComponent,
        EditTaskFilterCloudComponent,
        EditServiceTaskFilterCloudComponent
    ],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }
    ]
})
export class TaskFiltersCloudModule { }
