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

import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormModule } from '../form';

import { CoreModule, TRANSLATION_PROVIDER } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { MaterialModule } from './components/material.module';
import { ProcessUploadService } from './services/process-upload.service';
import { TaskListService } from './services/tasklist.service';

import { AppsListComponent } from './components/apps-list.component';
import { ChecklistComponent } from './components/checklist.component';
import { CommentListComponent } from './components/comment-list.component';
import { CommentsComponent } from './components/comments.component';
import { AttachmentComponent } from './components/create-task-attachment.component';
import { NoTaskDetailsTemplateDirective } from './components/no-task-detail-template.directive';
import { PeopleListComponent } from './components/people-list.component';
import { PeopleSearchActionLabelDirective, PeopleSearchComponent, PeopleSearchTitleDirective } from './components/people-search.component';
import { PeopleComponent } from './components/people.component';
import { StartTaskComponent } from './components/start-task.component';
import { TaskAttachmentListComponent } from './components/task-attachment-list.component';
import { TaskAuditDirective } from './components/task-audit.directive';
import { TaskDetailsComponent } from './components/task-details.component';
import { TaskFiltersComponent } from './components/task-filters.component';
import { TaskHeaderComponent } from './components/task-header.component';
import { TaskListComponent } from './components/task-list.component';

export const ACTIVITI_TASKLIST_DIRECTIVES: any[] = [
    NoTaskDetailsTemplateDirective,
    AppsListComponent,
    TaskFiltersComponent,
    TaskListComponent,
    TaskDetailsComponent,
    TaskAuditDirective,
    ChecklistComponent,
    CommentsComponent,
    PeopleComponent,
    TaskHeaderComponent,
    StartTaskComponent,
    PeopleSearchComponent,
    PeopleSearchTitleDirective,
    PeopleSearchActionLabelDirective,
    TaskAttachmentListComponent,
    AttachmentComponent,
    PeopleListComponent,
    CommentListComponent,
];

export const ACTIVITI_TASKLIST_PROVIDERS: any[] = [
    TaskListService,
    ProcessUploadService
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule,
        FormModule,
        FlexLayoutModule,
        MaterialModule
    ],
    declarations: [
        ...ACTIVITI_TASKLIST_DIRECTIVES
    ],
    providers: [
        ...ACTIVITI_TASKLIST_PROVIDERS,
        DatePipe,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-activiti-tasklist',
                source: 'assets/ng2-activiti-tasklist'
            }
        }
    ],
    exports: [
        ...ACTIVITI_TASKLIST_DIRECTIVES,
        MaterialModule
    ]
})
export class TaskListModule {}
