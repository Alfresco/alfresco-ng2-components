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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TaskFiltersCloudComponent } from './task-filters-cloud/task-filters-cloud.component';
import { MaterialModule } from '../material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderService, LogService, StorageService } from '@alfresco/adf-core';
import { TaskFilterCloudService } from './services/task-filter-cloud.service';
import { HttpClientModule } from '@angular/common/http';
import { EditTaskFilterCloudComponent } from './task-filters-cloud/edit-task-filter-cloud.component';
@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule,
        FlexLayoutModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderService
            }
        }),
        MaterialModule
    ],
    declarations: [TaskFiltersCloudComponent, EditTaskFilterCloudComponent],
    exports: [TaskFiltersCloudComponent, EditTaskFilterCloudComponent],
    providers: [TaskFilterCloudService, LogService, StorageService]
})
export class TaskCloudModule { }
