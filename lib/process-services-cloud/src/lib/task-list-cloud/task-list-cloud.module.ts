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
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { TaskListCloudComponent } from './components/task-list-cloud.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderService, DataTableModule, TemplateModule } from '@alfresco/adf-core';
import { TaskListCloudService } from './services/task-list-cloud.service';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderService
            }
        }),
        MaterialModule,
        DataTableModule,
        TemplateModule
    ],
    declarations: [TaskListCloudComponent],
    exports: [TaskListCloudComponent],
    providers: [TaskListCloudService]
})
export class TaskListCloudModule { }
