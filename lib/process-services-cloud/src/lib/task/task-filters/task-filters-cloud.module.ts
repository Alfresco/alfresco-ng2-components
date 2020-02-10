/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { FlexLayoutModule } from '@angular/flex-layout';
import { TaskFiltersCloudComponent } from './components/task-filters-cloud.component';
import { MaterialModule } from '../../material.module';
import { LogService, StorageService, CoreModule, MomentDateAdapter, MOMENT_DATE_FORMATS } from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';
import { EditTaskFilterCloudComponent } from './components/edit-task-filter-cloud.component';
import { TaskFilterDialogCloudComponent } from './components/task-filter-dialog-cloud.component';
import { AppListCloudModule } from './../../app/app-list-cloud.module';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        AppListCloudModule,
        CoreModule
    ],
    declarations: [TaskFiltersCloudComponent, EditTaskFilterCloudComponent, TaskFilterDialogCloudComponent],
    exports: [TaskFiltersCloudComponent, EditTaskFilterCloudComponent],
    providers: [
        LogService,
        StorageService,
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }
    ],
    entryComponents: [
        TaskFilterDialogCloudComponent
    ]
})
export class TaskFiltersCloudModule { }
