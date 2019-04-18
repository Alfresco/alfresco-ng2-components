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
import { FlexLayoutModule } from '@angular/flex-layout';
import { TemplateModule, FormBaseModule, PipeModule, CoreModule } from '@alfresco/adf-core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadCloudWidgetComponent } from './components/upload-cloud.widget';
import { MaterialModule } from '../material.module';
import { TaskFormCloudComponent } from './components/task-form-cloud.component';
import { TaskCloudModule } from '../task/task-cloud.module';
import { FormCloudComponent } from './components/form-cloud.component';

@NgModule({
    imports: [
      CommonModule,
      PipeModule,
        TemplateModule,
        FlexLayoutModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FormBaseModule,
        CoreModule,
        TaskCloudModule
    ],
    declarations: [FormCloudComponent, UploadCloudWidgetComponent, TaskFormCloudComponent],
    entryComponents: [
        UploadCloudWidgetComponent
    ],
    exports: [
        FormCloudComponent, UploadCloudWidgetComponent, TaskFormCloudComponent
    ]
})
export class FormCloudModule { }
