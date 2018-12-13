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
import { TemplateModule, TranslateLoaderService, DataTableModule, LogService, StorageService } from '@alfresco/adf-core';
import { ProcessFilterDialogCloudComponent } from './process-filters/components/process-filter-dialog-cloud.component';
import { ProcessFiltersCloudComponent } from './process-filters/components/process-filters-cloud.component';
import { ProcessListCloudComponent } from './process-list/components/process-list-cloud.component';
import { EditProcessFilterCloudComponent } from './process-filters/components/edit-process-filter-cloud.component';
import { ProcessFilterCloudService } from './process-filters/services/process-filter-cloud.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProcessListCloudService } from './process-list/services/process-list-cloud.service';

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
        MaterialModule,
        FlexLayoutModule,
        DataTableModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [
        ProcessFiltersCloudComponent,
        ProcessListCloudComponent,
        ProcessFiltersCloudComponent,
        EditProcessFilterCloudComponent,
        ProcessFilterDialogCloudComponent
    ],
    providers: [
        ProcessFilterCloudService,
        ProcessListCloudService,
        LogService,
        StorageService
    ],
    exports: [
        ProcessFiltersCloudComponent,
        ProcessListCloudComponent,
        ProcessFiltersCloudComponent,
        EditProcessFilterCloudComponent,
        ProcessFilterDialogCloudComponent
    ],
    entryComponents: [
        ProcessFilterDialogCloudComponent
    ]
})
export class ProcessCloudModule { }
