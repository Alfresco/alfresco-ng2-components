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
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProcessFiltersCloudComponent } from './components/process-filters-cloud.component';
import { MaterialModule } from '../../material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderService, LogService, StorageService } from '@alfresco/adf-core';
import { ProcessFilterCloudService } from './services/process-filter-cloud.service';
import { HttpClientModule } from '@angular/common/http';
import { EditProcessFilterCloudComponent } from './components/edit-process-filter-cloud.component';
import { ProcessFilterDialogCloudComponent } from './components/process-filter-dialog-cloud.component';
import { AppListCloudModule } from './../../app/app-list-cloud.module';
@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderService
            }
        }),
        FlexLayoutModule,
        MaterialModule,
        AppListCloudModule
    ],
    declarations: [ProcessFiltersCloudComponent, EditProcessFilterCloudComponent, ProcessFilterDialogCloudComponent],
    exports: [ProcessFiltersCloudComponent, EditProcessFilterCloudComponent, ProcessFilterDialogCloudComponent],
    entryComponents: [ProcessFilterDialogCloudComponent],
    providers: [ProcessFilterCloudService, LogService, StorageService]
})
export class ProcessFiltersCloudModule { }
