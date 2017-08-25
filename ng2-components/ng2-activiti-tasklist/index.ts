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
import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MdAutocompleteModule, MdButtonModule, MdCardModule, MdDatepickerModule, MdGridListModule,
    MdIconModule, MdInputModule, MdNativeDateModule, MdProgressSpinnerModule, MdSelectModule, MdRippleModule } from '@angular/material';
import { ActivitiFormModule } from 'ng2-activiti-form';
import { CoreModule, TRANSLATION_PROVIDER } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { PeopleService } from './src/services/people.service';
import { ProcessUploadService } from './src/services/process-upload.service';
import { TaskListService } from './src/services/tasklist.service';

import { AppsListComponent } from './src/components/apps-list.component';
import { ChecklistComponent } from './src/components/checklist.component';
import { CommentListComponent } from './src/components/comment-list.component';
import { CommentsComponent } from './src/components/comments.component';
import { AttachmentComponent } from './src/components/create-task-attachment.component';
import { NoTaskDetailsTemplateDirective } from './src/components/no-task-detail-template.directive';
import { PeopleListComponent } from './src/components/people-list.component';
import { PeopleSearchComponent } from './src/components/people-search.component';
import { PeopleComponent } from './src/components/people.component';
import { StartTaskComponent } from './src/components/start-task.component';
import { TaskAttachmentListComponent } from './src/components/task-attachment-list.component';
import { TaskAuditDirective } from './src/components/task-audit.directive';
import { TaskDetailsComponent } from './src/components/task-details.component';
import { TaskFiltersComponent } from './src/components/task-filters.component';
import { TaskHeaderComponent } from './src/components/task-header.component';
import { TaskListComponent } from './src/components/tasklist.component';

export {AppsListComponent } from './src/components/apps-list.component';
export {TaskListComponent } from './src/components/tasklist.component';
export {ChecklistComponent } from './src/components/checklist.component';
export {CommentsComponent } from './src/components/comments.component';
export {TaskAttachmentListComponent} from './src/components/task-attachment-list.component';
export {PeopleComponent } from './src/components/people.component';
export {TaskHeaderComponent } from './src/components/task-header.component';
export {NoTaskDetailsTemplateDirective } from './src/components/no-task-detail-template.directive';
export {TaskFiltersComponent } from './src/components/task-filters.component';
export {TaskDetailsComponent } from './src/components/task-details.component';
export {TaskAuditDirective } from './src/components/task-audit.directive';
export {StartTaskComponent } from './src/components/start-task.component';
export {PeopleSearchComponent } from './src/components/people-search.component';
export {AttachmentComponent } from './src/components/create-task-attachment.component';
export {PeopleListComponent } from './src/components/people-list.component';
export {CommentListComponent } from './src/components/comment-list.component';

export { TaskListService }  from './src/services/tasklist.service';
export { PeopleService }  from './src/services/people.service';
export { ProcessUploadService }  from './src/services/process-upload.service';

// Old Deprecated export
import {AppsListComponent as ActivitiApps } from './src/components/apps-list.component';
import {ChecklistComponent as ActivitiChecklist } from './src/components/checklist.component';
import {CommentsComponent as ActivitiComments } from './src/components/comments.component';
import {AttachmentComponent as ActivitiCreateTaskAttachmentComponent } from './src/components/create-task-attachment.component';
import {NoTaskDetailsTemplateDirective as NoTaskDetailsTemplateComponent } from './src/components/no-task-detail-template.directive';
import {PeopleListComponent as PeopleList } from './src/components/people-list.component';
import {PeopleSearchComponent as ActivitiPeopleSearch } from './src/components/people-search.component';
import {PeopleComponent as ActivitiPeople } from './src/components/people.component';
import {StartTaskComponent as ActivitiStartTaskButton } from './src/components/start-task.component';
import {TaskDetailsComponent as ActivitiTaskDetails } from './src/components/task-details.component';
import {TaskFiltersComponent as ActivitiFilters } from './src/components/task-filters.component';
import {TaskHeaderComponent as ActivitiTaskHeader } from './src/components/task-header.component';
import {TaskListComponent as ActivitiTaskList } from './src/components/tasklist.component';
import {PeopleService as ActivitiPeopleService } from './src/services/people.service';
import {TaskListService as ActivitiTaskListService } from './src/services/tasklist.service';
export {AppsListComponent as ActivitiApps} from './src/components/apps-list.component';
export {ChecklistComponent as ActivitiChecklist} from './src/components/checklist.component';
export {CommentsComponent as ActivitiComments} from './src/components/comments.component';
export {AttachmentComponent as ActivitiCreateTaskAttachmentComponent } from './src/components/create-task-attachment.component';
export {NoTaskDetailsTemplateDirective as NoTaskDetailsTemplateComponent } from './src/components/no-task-detail-template.directive';
export {PeopleListComponent as PeopleList } from './src/components/people-list.component';
export {PeopleSearchComponent as ActivitiPeopleSearch } from './src/components/people-search.component';
export {PeopleComponent as ActivitiPeople} from './src/components/people.component';
export {StartTaskComponent as ActivitiStartTaskButton } from './src/components/start-task.component';
export {TaskDetailsComponent as ActivitiTaskDetails } from './src/components/task-details.component';
export {TaskFiltersComponent as ActivitiFilters } from './src/components/task-filters.component';
export {TaskHeaderComponent as ActivitiTaskHeader} from './src/components/task-header.component';
export {TaskListComponent as ActivitiTaskList } from './src/components/tasklist.component';
export {PeopleService as ActivitiPeopleService } from './src/services/people.service';
export {TaskListService as ActivitiTaskListService } from './src/services/tasklist.service';

export * from './src/models/comment.model';
export * from './src/models/filter.model';
export * from './src/models/icon.model';
export * from './src/models/user.model';
export * from './src/models/task-details.model';
export * from './src/models/task-details.event';
export * from './src/models/user-event.model';
export * from './src/models/start-task.model';

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
    PeopleService,
    ProcessUploadService,

    // Old Deprecated export
    ActivitiTaskListService,
    ActivitiPeopleService
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule,
        ActivitiFormModule,
        MdIconModule,
        MdButtonModule,
        MdInputModule,
        MdCardModule,
        MdProgressSpinnerModule,
        MdDatepickerModule,
        MdNativeDateModule,
        MdSelectModule,
        MdAutocompleteModule,
        MdGridListModule,
        MdRippleModule
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
        MdIconModule,
        MdButtonModule
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
})
export class ActivitiTaskListModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ActivitiTaskListModule,
            providers: [
                ...ACTIVITI_TASKLIST_PROVIDERS
            ]
        };
    }
}
