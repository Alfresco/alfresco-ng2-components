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
import { MaterialModule } from '../../material.module';
import { DataTableModule, TemplateModule, CardViewModule, CoreModule } from '@alfresco/adf-core';
import { TaskHeaderCloudComponent } from './components/task-header-cloud.component';
import { TaskHeaderCloudService } from './services/task-header-cloud.service';
import { CompleteTaskDirective } from './directives/complete-task.directive';
import { TaskCloudService } from './services/task-cloud.service';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        DataTableModule,
        TemplateModule,
        CardViewModule,
        CoreModule
    ],
    declarations: [
        TaskHeaderCloudComponent,
        CompleteTaskDirective
    ],
    exports: [
        TaskHeaderCloudComponent
    ],
    providers: [
        TaskHeaderCloudService,
        TaskCloudService
    ]
})
export class TaskHeaderCloudModule { }
