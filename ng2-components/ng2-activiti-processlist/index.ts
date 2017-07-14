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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { MdProgressSpinnerModule } from '@angular/material';
import { ActivitiFormModule } from 'ng2-activiti-form';
import { ActivitiTaskListModule } from 'ng2-activiti-tasklist';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';

import {
    CreateProcessAttachmentComponent,
    ProcessFiltersComponent,
    ProcessAttachmentListComponent,
    ProcessCommentsComponent,
    ProcessInstanceDetailsComponent,
    ProcessInstanceHeaderComponent,
    ProcessInstanceListComponent,
    ProcessInstanceTasksComponent,
    ProcessInstanceVariablesComponent,
    StartProcessInstanceComponent
} from './src/components/index';

import { ProcessUploadService } from './src/services/process-upload.service';
import { ProcessService } from './src/services/process.service';

// components
export * from './src/components/processlist.component';
export * from './src/components/process-filters.component';
export * from './src/components/process-instance-details.component';
export * from './src/components/start-process.component';
export * from './src/components/process-attachment-list.component';
export * from './src/components/create-process-attachment.component';
export * from './src/services/process-upload.service';

// models
export * from './src/models/index';

// services
export * from './src/services/process.service';

export const ACTIVITI_PROCESSLIST_DIRECTIVES: [any] = [
    ProcessInstanceListComponent,
    ProcessFiltersComponent,
    ProcessInstanceDetailsComponent,
    ProcessInstanceHeaderComponent,
    ProcessInstanceTasksComponent,
    ProcessInstanceVariablesComponent,
    ProcessCommentsComponent,
    StartProcessInstanceComponent,
    ProcessAttachmentListComponent,
    CreateProcessAttachmentComponent
];

export const ACTIVITI_PROCESSLIST_PROVIDERS: [any] = [
    ProcessService,
    ProcessUploadService
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule,
        ActivitiFormModule,
        ActivitiTaskListModule,
        MdProgressSpinnerModule
    ],
    declarations: [
        ...ACTIVITI_PROCESSLIST_DIRECTIVES
    ],
    providers: [
        ...ACTIVITI_PROCESSLIST_PROVIDERS
    ],
    exports: [
        ...ACTIVITI_PROCESSLIST_DIRECTIVES
    ]
})
export class ActivitiProcessListModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ActivitiProcessListModule,
            providers: [
                ...ACTIVITI_PROCESSLIST_PROVIDERS
            ]
        };
    }
}
