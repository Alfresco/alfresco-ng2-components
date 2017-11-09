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
import { ActivitiFormModule } from 'ng2-activiti-form';

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

export {AppsListComponent } from './components/apps-list.component';
export {TaskListComponent } from './components/task-list.component';
export {ChecklistComponent } from './components/checklist.component';
export {CommentsComponent } from './components/comments.component';
export {TaskAttachmentListComponent} from './components/task-attachment-list.component';
export {PeopleComponent } from './components/people.component';
export {TaskHeaderComponent } from './components/task-header.component';
export {NoTaskDetailsTemplateDirective } from './components/no-task-detail-template.directive';
export {TaskFiltersComponent } from './components/task-filters.component';
export {TaskDetailsComponent } from './components/task-details.component';
export {TaskAuditDirective } from './components/task-audit.directive';
export {StartTaskComponent } from './components/start-task.component';
export {PeopleSearchComponent, PeopleSearchTitleDirective } from './components/people-search.component';
export {AttachmentComponent } from './components/create-task-attachment.component';
export {PeopleListComponent } from './components/people-list.component';
export {CommentListComponent } from './components/comment-list.component';

export { TaskListService }  from './services/tasklist.service';
export { ProcessUploadService }  from './services/process-upload.service';

// Old Deprecated export
import {AppsListComponent as ActivitiApps } from './components/apps-list.component';
import {ChecklistComponent as ActivitiChecklist } from './components/checklist.component';
import {CommentsComponent as ActivitiComments } from './components/comments.component';
import {AttachmentComponent as ActivitiCreateTaskAttachmentComponent } from './components/create-task-attachment.component';
import {NoTaskDetailsTemplateDirective as NoTaskDetailsTemplateComponent } from './components/no-task-detail-template.directive';
import {PeopleListComponent as PeopleList } from './components/people-list.component';
import {PeopleSearchComponent as ActivitiPeopleSearch } from './components/people-search.component';
import {PeopleComponent as ActivitiPeople } from './components/people.component';
import {StartTaskComponent as ActivitiStartTaskButton } from './components/start-task.component';
import {TaskDetailsComponent as ActivitiTaskDetails } from './components/task-details.component';
import {TaskFiltersComponent as ActivitiFilters } from './components/task-filters.component';
import {TaskHeaderComponent as ActivitiTaskHeader } from './components/task-header.component';
import {TaskListComponent as ActivitiTaskList } from './components/task-list.component';
import {TaskListService as ActivitiTaskListService } from './services/tasklist.service';
export {AppsListComponent as ActivitiApps} from './components/apps-list.component';
export {ChecklistComponent as ActivitiChecklist} from './components/checklist.component';
export {CommentsComponent as ActivitiComments} from './components/comments.component';
export {AttachmentComponent as ActivitiCreateTaskAttachmentComponent } from './components/create-task-attachment.component';
export {NoTaskDetailsTemplateDirective as NoTaskDetailsTemplateComponent } from './components/no-task-detail-template.directive';
export {PeopleListComponent as PeopleList } from './components/people-list.component';
export {PeopleSearchComponent as ActivitiPeopleSearch } from './components/people-search.component';
export {PeopleComponent as ActivitiPeople} from './components/people.component';
export {StartTaskComponent as ActivitiStartTaskButton } from './components/start-task.component';
export {TaskDetailsComponent as ActivitiTaskDetails } from './components/task-details.component';
export {TaskFiltersComponent as ActivitiFilters } from './components/task-filters.component';
export {TaskHeaderComponent as ActivitiTaskHeader} from './components/task-header.component';
export {TaskListComponent as ActivitiTaskList } from './components/task-list.component';
export {TaskListService as ActivitiTaskListService } from './services/tasklist.service';

export * from './models/filter.model';
export * from './models/icon.model';
export * from './models/task-details.model';
export * from './models/task-details.event';
export * from './models/user-event.model';
export * from './models/start-task.model';

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

// Old Deprecated export
    ActivitiApps,
    ActivitiTaskList,
    ActivitiTaskDetails,
    ActivitiFilters,
    NoTaskDetailsTemplateComponent,
    ActivitiChecklist,
    ActivitiComments,
    ActivitiPeople,
    ActivitiTaskHeader,
    ActivitiStartTaskButton,
    ActivitiPeopleSearch,
    ActivitiCreateTaskAttachmentComponent,
    PeopleList
];

export const ACTIVITI_TASKLIST_PROVIDERS: any[] = [
    TaskListService,
    ProcessUploadService,

    // Old Deprecated export
    ActivitiTaskListService
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule,
        ActivitiFormModule,
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
