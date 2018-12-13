/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TemplateModule, TranslateLoaderService, DataTableModule, LogService, StorageService, FormModule } from '@alfresco/adf-core';
import { TaskListCloudComponent } from './task-list/components/task-list-cloud.component';
import { TaskListCloudService } from './task-list/services/task-list-cloud.service';
import { TaskFiltersCloudComponent } from './task-filters/components/task-filters-cloud.component';
import { EditTaskFilterCloudComponent } from './task-filters/components/edit-task-filter-cloud.component';
import { TaskFilterDialogCloudComponent } from './task-filters/components/task-filter-dialog-cloud.component';
import { TaskFilterCloudService } from './task-filters/services/task-filter-cloud.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PeopleCloudModule } from '../people/people-cloud.module';
import { StartTaskCloudComponent } from './start-task/components/start-task-cloud.component';
import { StartTaskCloudService } from './start-task/services/start-task-cloud.service';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderService
            }
        }),
        TemplateModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        FlexLayoutModule,
        DataTableModule,
        FormModule,
        PeopleCloudModule
    ],
    declarations: [
        TaskListCloudComponent,
        TaskFiltersCloudComponent,
        EditTaskFilterCloudComponent,
        TaskFilterDialogCloudComponent,
        StartTaskCloudComponent
    ],
    providers: [
        TaskListCloudService,
        TaskFilterCloudService,
        LogService,
        StorageService,
        StartTaskCloudService
    ],
    exports: [
        TaskListCloudComponent,
        TaskFiltersCloudComponent,
        EditTaskFilterCloudComponent,
        StartTaskCloudComponent
    ],
    entryComponents: [
        TaskFilterDialogCloudComponent
    ]
})
export class TaskCloudModule { }
