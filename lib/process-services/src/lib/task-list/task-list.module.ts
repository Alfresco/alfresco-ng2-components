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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@alfresco/adf-core';
import { ProcessCommentsModule } from '../process-comments/process-comments.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';
import { PeopleModule } from '../people/people.module';
import { ContentWidgetModule } from '../form/widgets/content-widget/content-widget.module';

import { ChecklistComponent } from './components/checklist.component';
import { NoTaskDetailsTemplateDirective } from './components/no-task-detail-template.directive';
import { StartTaskComponent } from './components/start-task.component';
import { TaskAuditDirective } from './components/task-audit.directive';
import { TaskDetailsComponent } from './components/task-details.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskFiltersComponent } from './components/task-filters.component';
import { TaskHeaderComponent } from './components/task-header.component';
import { TaskListComponent } from './components/task-list.component';
import { TaskStandaloneComponent } from './components/task-standalone.component';
import { AttachFormComponent } from './components/attach-form.component';
import { FormModule } from '../form/form.module';
import { ClaimTaskDirective } from './components/task-form/claim-task.directive';
import { UnclaimTaskDirective } from './components/task-form/unclaim-task.directive';
import { TaskCommentsModule } from '../task-comments/task-comments.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        FormModule,
        ReactiveFormsModule,
        CoreModule,
        PeopleModule,
        ProcessCommentsModule,
        ContentWidgetModule,
        TaskCommentsModule
    ],
    declarations: [
        NoTaskDetailsTemplateDirective,
        TaskFiltersComponent,
        TaskListComponent,
        TaskDetailsComponent,
        TaskFormComponent,
        TaskAuditDirective,
        ChecklistComponent,
        TaskHeaderComponent,
        StartTaskComponent,
        TaskStandaloneComponent,
        AttachFormComponent,
        ClaimTaskDirective,
        UnclaimTaskDirective
    ],
    exports: [
        NoTaskDetailsTemplateDirective,
        TaskFiltersComponent,
        TaskListComponent,
        TaskDetailsComponent,
        TaskFormComponent,
        TaskAuditDirective,
        ChecklistComponent,
        TaskHeaderComponent,
        StartTaskComponent,
        TaskStandaloneComponent,
        AttachFormComponent,
        ClaimTaskDirective,
        UnclaimTaskDirective
    ]
})
export class TaskListModule {
}
