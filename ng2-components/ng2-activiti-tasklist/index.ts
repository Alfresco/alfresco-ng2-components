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
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
    MdAutocompleteModule,
    MdButtonModule,
    MdCardModule,
    MdDatepickerModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdNativeDateModule,
    MdProgressSpinnerModule,
    MdSelectModule
} from '@angular/material';
import { ActivitiFormModule } from 'ng2-activiti-form';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { PeopleService } from './src/services/people.service';
import { ProcessUploadService } from './src/services/process-upload.service';
import { TaskListService } from './src/services/tasklist.service';

import {
    AppsListComponent,
    AttachmentComponent,
    ChecklistComponent,
    CommentListComponent,
    CommentsComponent,
    TaskFiltersComponent,
    NoTaskDetailsTemplateDirective,
    PeopleComponent,
    PeopleListComponent,
    PeopleSearchComponent,
    StartTaskComponent,
    TaskAttachmentListComponent,
    TaskDetailsComponent,
    TaskHeaderComponent,
    TaskListComponent
} from './src/components/index';

export * from './src/components/index';
export * from './src/services/tasklist.service';
export * from './src/services/people.service';
export * from './src/services/process-upload.service';
export * from  './src/models/index';

export const ACTIVITI_TASKLIST_DIRECTIVES: any[] = [
    NoTaskDetailsTemplateDirective,
    AppsListComponent,
    TaskFiltersComponent,
    TaskListComponent,
    TaskDetailsComponent,
    ChecklistComponent,
    CommentsComponent,
    PeopleComponent,
    TaskHeaderComponent,
    StartTaskComponent,
    PeopleSearchComponent,
    TaskAttachmentListComponent,
    AttachmentComponent,
    PeopleListComponent,
    CommentListComponent
];

export const ACTIVITI_TASKLIST_PROVIDERS: any[] = [
    TaskListService,
    PeopleService,
    ProcessUploadService
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
        MdGridListModule
    ],
    declarations: [
        ...ACTIVITI_TASKLIST_DIRECTIVES
    ],
    providers: [
        ...ACTIVITI_TASKLIST_PROVIDERS,
        DatePipe
    ],
    exports: [
        ...ACTIVITI_TASKLIST_DIRECTIVES,
        MdIconModule,
        MdButtonModule
    ]
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
