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

import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../form';

import { CardViewModule, DataColumnModule,  DataTableModule, DirectiveModule, InfoDrawerModule } from '@alfresco/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';
import { ProcessUploadService } from './services/process-upload.service';
import { TaskListService } from './services/tasklist.service';

import { ChecklistComponent } from './components/checklist.component';
import { NoTaskDetailsTemplateDirective } from './components/no-task-detail-template.directive';
import { StartTaskComponent } from './components/start-task.component';
import { TaskAuditDirective } from './components/task-audit.directive';
import { TaskDetailsComponent } from './components/task-details.component';
import { TaskFiltersComponent } from './components/task-filters.component';
import { TaskHeaderComponent } from './components/task-header.component';
import { TaskListComponent } from './components/task-list.component';

@NgModule({
    imports: [
        CommonModule,
        CardViewModule,
        DataTableModule,
        DataColumnModule,
        DirectiveModule,
        FormModule,
        FlexLayoutModule,
        InfoDrawerModule,
        MaterialModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        NoTaskDetailsTemplateDirective,
        TaskFiltersComponent,
        TaskListComponent,
        TaskDetailsComponent,
        TaskAuditDirective,
        ChecklistComponent,
        TaskHeaderComponent,
        StartTaskComponent
    ],
    providers: [
        TaskListService,
        ProcessUploadService,
        DatePipe
    ],
    exports: [
        NoTaskDetailsTemplateDirective,
        TaskFiltersComponent,
        TaskListComponent,
        TaskDetailsComponent,
        TaskAuditDirective,
        ChecklistComponent,
        TaskHeaderComponent,
        StartTaskComponent
    ]
})
export class TaskListModule {}
